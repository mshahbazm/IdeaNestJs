import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { Otp, OtpSchema } from './entities/otp.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailsService } from 'src/common/services/email/email.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  providers: [ConfigService, EmailsService, OtpService],
  exports: [OtpService]
})
export class OtpModule {}
