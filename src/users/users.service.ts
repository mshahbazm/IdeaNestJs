import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User, UserDocument } from './entities/user.entity'
import { MongoService } from '../common/services/mongo/mongo.service'
import { OtpService } from 'src/otp/otp.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { iChangePassword } from './users.controller'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private jwtService: JwtService,
		private queryHelpers: MongoService,
		private config: ConfigService,
		private otpService: OtpService,
	) {}

	private async create(body: User) {
		const user = new this.userModel({ ...body })
		return user.save()
	}

	async generateAccessToken(email: string, _id: Types.ObjectId) {
		const payload = { email, _id }
		return {
			access_token: this.jwtService.sign(payload, {
				secret: this.config.get('JWT_SECRET'),
			}),
		}
	}

	async registerByEmail(body: User) {
		if (body.permissions){
			body.permissions = body.permissions.toString().trim().split(',')
		}
		const user = await this.create(body)
		return this.generateAccessToken(user.email, user._id)
	}

	async updatePassword(body: iChangePassword) {
		const isValidOtp = await this.otpService.verifyCode(
			body.otp,
			body.email
		)
		if (!isValidOtp)
			throw new HttpException(
				'Unprocessable',
				HttpStatus.UNPROCESSABLE_ENTITY
			)

		const user = await this.userModel.findOne({ email: body.email })
		if (!user)
			throw new HttpException(
				'Unprocessable',
				HttpStatus.UNPROCESSABLE_ENTITY
			)
		user.password = body.newPassword
		await user.save()
		return this.generateAccessToken(user.email, user._id)
	}

	async findAll(queryObject: Record<string, unknown>) {
		const { query, skip } = this.queryHelpers.build(queryObject)
		return this.userModel.find(query).skip(skip).exec()
	}

	async findById(id: Types.ObjectId) {
		return this.userModel.findById(id)
	}

	async findOne(queryObject: Record<string, unknown>): Promise<UserDocument> {
		return this.userModel.findOne({ ...queryObject })
	}

	async findOneForAuth(email: string): Promise<UserDocument> {
		return this.userModel.findOne({ email }).select('+password')
	}

	async deactivateUser(id: Types.ObjectId) {
		return this.userModel
			.findOneAndUpdate({ _id: id }, { Active: false }, { new: true })
			.orFail()
	}

	async activateUser(id: Types.ObjectId) {
		return this.userModel
			.findOneAndUpdate({ _id: id }, { Active: true }, { new: true })
			.orFail()
	}

	async update(id: Types.ObjectId, updates: any) {
		if (updates.email || updates.password) {
			if (!updates.currentPassword)
				throw new HttpException(
					'Current password is required for this action.',
					HttpStatus.UNAUTHORIZED
				)
			const user = await this.userModel.findById(id).select('+password')
			const valid = await bcrypt.compare(
				updates.currentPassword,
				user.password
			)
			if (!valid) {
				throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
			}
			if (updates.password) {
				user.password = updates.password
				await user.save()
				delete updates.password
			}
			delete updates.currentPassword
		}

		return this.userModel
			.findOneAndUpdate({ _id: id }, { ...updates }, { new: true })
			.orFail()
	}
}
