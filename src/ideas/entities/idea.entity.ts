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
	clickCount: number

	@Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }] })
	tags: Types.ObjectId[]

	@Prop({ default: 1 })
	minAge: number

	@Prop({ default: 100 })
	maxAge: number

	@Prop({ default: 'unisex' })
	gender: string

	@Prop({ required: true })
	image_amazon: string

	@Prop({ required: true })
	image_aliexpress: string

	@Prop({ required: true })
	url_amazon: string

	@Prop({ required: true })
	url_aliexpress: string

	@Prop({ ref: 'User', type: Types.ObjectId })
	creator: Types.ObjectId
}

export const IdeaSchema = SchemaFactory.createForClass(Idea)
