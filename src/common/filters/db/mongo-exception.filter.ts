import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        let resData : any;
        switch (exception.code) {
            case 11000:
                resData = {
                    statusCode: 400,
                    errors: exception,
                    message: "duplicate data"
                }
                break;
            default: 
                resData = {
                    statusCode: 400,
                    errors: exception,
                    message: exception.message
                }

        }
        const ctx = host.switchToHttp(),
            response = ctx.getResponse();
        return response.status(400).json(resData);
    }
}