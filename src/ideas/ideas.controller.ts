import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	Request,
	UseGuards,
	Query,
	ForbiddenException,
	HttpException,
	HttpStatus,
	UploadedFiles,
} from '@nestjs/common'
import { Express } from 'express'
import { IdeasService } from './ideas.service'
import {
	FileFieldsInterceptor,
	FilesInterceptor,
} from '@nestjs/platform-express'
import { MyRequest, JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Idea } from './entities/idea.entity'
import { Types } from 'mongoose'
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { Permissions } from 'src/auth/decorators/permissions.decorator'
import { OptionalAuthGuard } from 'src/auth/guards/optional-auth.guard'
import { permissions } from 'src/users/entities/user.entity'
import { diskStorage } from 'multer'
import { editFileName } from '../common/helpers/filename'

export interface ideaFiles {
	image_amazon?: Express.Multer.File[]
	image_aliexpress?: Express.Multer.File[]
}

@Controller('ideas')
export class IdeasController {
	constructor(private readonly ideasService: IdeasService) {}

	@UseGuards(OptionalAuthGuard)
	@Get()
	async findAll(
		@Query() query: Record<string, unknown>,
		@Request() req: MyRequest
	) {
		const ideas = await this.ideasService.findAll(query)
		return {
			...ideas,
			viewer: req.user ? req.user : null,
		}
	}

	@Post()
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permissions(permissions.ADD_IDEAS)
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'image_amazon', maxCount: 1 },
				{ name: 'image_aliexpress', maxCount: 1 },
			],
			{
				storage: diskStorage({
					destination: './files',
					filename: editFileName,
				}),
			}
		)
	)
	create(
		@Request() req: MyRequest,
		@Body() body: Idea,
		@UploadedFiles()
		files: ideaFiles
	) {
		const ideaBody = { ...body, creator: req.user?._id }
		return this.ideasService.newIdea(ideaBody, files)
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permissions(permissions.ADD_IDEAS)
	async getOne(@Param('id') id: Types.ObjectId, @Request() req: MyRequest) {
		const idea = await this.ideasService.findById(id)
		if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND)
		return {
			viewer: req.user,
			idea,
		}
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permissions(permissions.ADD_IDEAS)
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'image_amazon', maxCount: 1 },
				{ name: 'image_aliexpress', maxCount: 1 },
			],
			{
				storage: diskStorage({
					destination: './files',
					filename: editFileName,
				}),
			}
		)
	)
	update(
		@Param('id') id: Types.ObjectId,
		@Body() updates: Idea,
		@Request() req: MyRequest,
		@UploadedFiles()
		files: ideaFiles
	) {
		return this.ideasService.update(id, updates, files, req.user._id)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, PermissionsGuard)
	@Permissions(permissions.DELETE_IDEAS)
	remove(@Param('id') id: Types.ObjectId, @Request() req: MyRequest) {
		if (!req?.user?.permissions?.includes('add_ideas'))
			throw new ForbiddenException('Insufficient permissions')
		return this.ideasService.delete(id)
	}
}
