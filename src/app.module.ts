import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GlobalJwtModule } from './common/modules/globalJwt.module'
import { IdeasModule } from './ideas/ideas.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'


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
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'files'),
		}),
		AuthModule,
		IdeasModule,
		UsersModule,
	],
})
export class AppModule {}
