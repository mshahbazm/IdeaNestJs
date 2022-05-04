import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type IdeaDocument = Idea & Document

@Schema({ timestamps: true })
export class Idea {
	@Prop({ required: true, unique: true })
	title: string

	@Prop()
	description: string

	@Prop({ default: true })
	isPublished: boolean

	@Prop({ default: 0 })
	price: number

	@Prop({ default: 0 })
	clickCount: number

	@Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }] })
	tags: Types.ObjectId[]

	@Prop({ required: true })
	picture: string

	@Prop({ required: true })
	external_url: string

	@Prop()
	source: string

	@Prop({ ref: 'User', type: Types.ObjectId })
	creator: Types.ObjectId
}

export const IdeaSchema = SchemaFactory.createForClass(Idea)
