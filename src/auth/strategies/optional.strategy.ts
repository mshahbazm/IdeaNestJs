
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';

@Injectable()
export class OptionalStrategy extends PassportStrategy(Strategy, 'optional') {
    constructor() {
        super();
    }

    authenticate() {
        return this.success({})
    }
}
