import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import * as bcrypt from 'bcryptjs'

export type UserDocument = User & Document

export enum permissions {
	ADD_IDEAS = 'add_ideas',
	ADD_USERS = 'add_users',
	LIST_USERS = 'list_users',
	DELETE_IDEAS = 'delete_ideas',
}

@Schema({ timestamps: true })
export class User {
	_id: Types.ObjectId

	@Prop()
	name: string

	@Prop({ select: false })
	password?: string

	@Prop({ required: true, index: true, unique: true })
	email: string

	@Prop({ default: false, required: true })
	verified: boolean

	@Prop()
	picture: string

	@Prop()
	phone: string

	@Prop()
	bio: string

	@Prop([String])
	permissions: string[]
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', function (next) {
	const user = this as UserDocument
	if (!this.isModified('password')) {
		next()
	}
	bcrypt.hash(user.password, 10, function (err, hash) {
		user.password = hash
		next()
	})
})
