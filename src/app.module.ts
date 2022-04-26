import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GlobalJwtModule } from './common/modules/globalJwt.module'
import { IdeasModule } from './ideas/ideas.module'

@Module({
	imports: [
		GlobalJwtModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({
			useFactory: async (config: ConfigService) => ({
				uri: config.get('MONGO_URI'),
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		IdeasModule,
		UsersModule,
	],
})
export class AppModule {}
