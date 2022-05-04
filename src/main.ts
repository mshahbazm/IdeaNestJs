import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MongoExceptionFilter } from './common/filters/db/mongo-exception.filter'

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule)
	app.useGlobalFilters(new MongoExceptionFilter())
	app.enableCors()
	await app.listen(8080)
}

bootstrap()
