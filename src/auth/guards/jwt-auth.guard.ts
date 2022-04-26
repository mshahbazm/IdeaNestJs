import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Types } from 'mongoose';


type JwtDecodedUser = {
    _id: Types.ObjectId,
    email?: string,
    permissions?: string[]
}

/**
 * Extending Express Request to add user object i.e. req.user which is only vailible if used JwtAuthGuard
 *
 * @interface MyRequest
 */

export interface MyRequest extends Request{
    user: JwtDecodedUser
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
