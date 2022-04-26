import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Request,
	Param,
	UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { Types } from 'mongoose'
import { JwtAuthGuard, MyRequest } from '../auth/guards/jwt-auth.guard'
import { permissions, User } from './entities/user.entity'
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'

export interface iChangePassword {
	otp: string
	email: string
	newPassword: string
}

@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('register')
	create(@Body() body: User) {
		return this.usersService.registerByEmail(body)
	}

	@Post('change-password')
	changePassword(@Body() body: iChangePassword) {
		return this.usersService.updatePassword(body)
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	getProfile(@Request() req: MyRequest) {
		return this.usersService.findById(req.user._id)
	}

	@Post('query')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permissions(permissions.LIST_USERS)
	findAll(@Body() body: Record<string, unknown>) {
		return this.usersService.findAll(body)
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permissions(permissions.LIST_USERS)
	findOne(@Param('id') id: Types.ObjectId) {
		return this.usersService.findById(id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('me')
	updateMe(@Body() updates: User, @Request() req: MyRequest) {
		return this.usersService.update(req.user._id, updates)
	}


	@Patch('deactivate/:id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permissions(permissions.ADD_USERS)
	deactivateUser(@Param('id') id: Types.ObjectId) {
		return this.usersService.deactivateUser(id)
	}

	@Patch('activate/:id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permissions(permissions.ADD_USERS)
	activateUser(@Param('id') id: Types.ObjectId) {
		return this.usersService.activateUser(id)
	}
}
