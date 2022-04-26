import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Otp, OtpDocument } from './entities/otp.entity';
import { customAlphabet } from 'nanoid'
import { EmailsService } from 'src/common/services/email/email.service';
import { ConfigService } from '@nestjs/config';
import { triggerAsyncId } from 'async_hooks';

@Injectable()
export class OtpService {
    private _nanoid: () => string;
    constructor(
        @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
        private email: EmailsService,
        private config: ConfigService
    ) {
        this._nanoid = customAlphabet('012345678', 6)
    }
    private async create(email: string) {
        const code = this._nanoid();
        let obj = { code, email };
        const newOtp = new this.otpModel(obj);
        await newOtp.save();
        return code;
    }

    private isValidEmail(email: string) {
        return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(email);
    }

    async sendByEmail(email: string) {

        if(!this.isValidEmail(email)) throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);

        const otpCode = await this.create(email);
        //todo: remove magic string
        console.log(`Your verification code is ${otpCode}`);
        try {
            const response = await this.email.send({
                to: email,
                from: this.config.get('FROM_EMAIL_ADDRESS'),
                subject: 'Your verification code from illustratious.com',
                messageInText: `Your verification code is ${otpCode}`
            });
        } catch (e) {
            console.log('Email send failed: ', e);
        }
        return {
            "statusCode": 200,
            "message": "Success"
        }
    }

    async verifyCode(code: string, email: string) {
        const otpCode = await this.otpModel.findOne({ code, email });
        if (!otpCode) return false;
        await this.otpModel.deleteOne({ _id: otpCode._id });
        return true;
    }

}
