import { Module } from '@nestjs/common'
import { IdeasService } from './ideas.service'
import { IdeasController } from './ideas.controller'
import { TagsModule } from 'src/tags/tags.module'
import { MongooseModule } from '@nestjs/mongoose'
import { Idea, IdeaSchema } from './entities/idea.entity'
import { MongoService } from 'src/common/services/mongo/mongo.service'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Idea.name, schema: IdeaSchema }]),
		MulterModule.register({
			storage: memoryStorage(),
		}),
		TagsModule,
	],
	controllers: [IdeasController],
	providers: [MongoService, IdeasService],
	exports: [IdeasService],
})
export class IdeasModule {}
