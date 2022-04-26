import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [
		{
			...JwtModule.registerAsync({
				useFactory: async (config: ConfigService) => ({
					secret: config.get('JWT_SECRET'),
					signOptions: { expiresIn: '7d' },
				}),
				inject: [ConfigService],
			}),
			global: true,
		},
	],
	exports: [JwtModule],
})
export class GlobalJwtModule {}
