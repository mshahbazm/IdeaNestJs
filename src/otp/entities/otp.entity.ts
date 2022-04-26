import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import {Document, ObjectId} from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({timestamps: true})

export class Otp {

    _id: ObjectId;

    @Prop()
    code: string;
    
    @Prop()
    email: string;

    @Prop({ type: Date, expires: '15m' })
    createdAt?: Date
}

export const OtpSchema = SchemaFactory.createForClass(Otp);