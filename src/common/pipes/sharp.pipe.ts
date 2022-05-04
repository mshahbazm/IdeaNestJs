import { Injectable, PipeTransform } from '@nestjs/common'
import * as path from 'path'
import sharp from 'sharp'
import { v1 } from 'uuid'

@Injectable()
export class SharpPipe
	implements PipeTransform<Express.Multer.File, Promise<string>>
{
	async transform(picture: Express.Multer.File): Promise<string> {
		const filename = `${v1()}.jpg`
		await sharp(picture.buffer)
			.jpeg({ mozjpeg: true })
			.toFile(path.join('files', filename))
		return filename
	}
}
