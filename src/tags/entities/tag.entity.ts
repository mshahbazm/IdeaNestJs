import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import {Document, ObjectId} from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({timestamps: true})
export class Tag {

    _id: ObjectId;

    @Prop({required: true, unique: true})
    title: string;
    
}

export const TagSchema = SchemaFactory.createForClass(Tag);