import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Request,
	Param,
	UseGuards,
	UseInterceptors,
	UploadedFile,
	HttpException,
	HttpStatus,
	Type,
	Put,
} from '@nestjs/common'
import { TagsService } from './tags.service'

@Controller('tags')
export class TagsController {
	constructor(private readonly tagService: TagsService) {}

	@Get('search/:keyword')
	async findAll(@Param('keyword') keyword: string) {
		return this.tagService.searchInTags(keyword)
	}
}
