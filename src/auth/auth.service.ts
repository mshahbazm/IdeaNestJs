import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneForAuth(email);
        if (user) {
            const valid = await bcrypt.compare(password, user.password);
            console.log(valid);
            if (valid) {
                const { password, ...userData } = user.toObject();
                return userData;
            }
        }
        return null;
    }

    async validateUserById(userId: Types.ObjectId){
        return this.usersService.findById(userId);
    }

    async userOauth(userData: Record<string, string>, emailFieldName = 'email'): Promise<any> {
        if (userData[emailFieldName]) {
            const user = await this.usersService.findOneForAuth(userData[emailFieldName]);
            if (user) {
            }
        }
    }
    
    async getAccessToken(user: User) {
        const payload = { email: user.email, _id: user._id };
        return {
            access_token: this.jwtService.sign(payload, { secret: this.config.get('JWT_SECRET') }),
        };
    }
}
