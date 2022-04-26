import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './entities/user.entity'
import { MongoService } from '../common/services/mongo/mongo.service'
import { OtpModule } from 'src/otp/otp.module'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		OtpModule,
	],
	providers: [MongoService, UsersService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
