import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoService {

    build(queryObject: Record<string, unknown>) {

        let skip = 0;
        let pageSize = 20;
        if (!queryObject.page) queryObject.page = 0; 
        else queryObject.page = +queryObject.page - 1;
        pageSize = queryObject.page_size ? queryObject.page_size as number : pageSize;
        if (pageSize < 15) pageSize = 20;
        if (pageSize > 30) pageSize = 30; 
        skip = pageSize * +queryObject.page;
        queryObject.page = +queryObject.page + 1;

        let query = {};
        let orQuery = [];

        if (queryObject.tagIds && (queryObject.tagIds as []).length) {
            orQuery.push({
                tags: { $in: queryObject.tagIds }
            })
        }
        if (queryObject.search) {
            orQuery.push({
                title: new RegExp(queryObject.search as string, 'i')
            });
        }
        if (orQuery && orQuery.length) {
            query = {
                $or: orQuery
            };
        }
        if(!queryObject.category ) queryObject.category  = 'illustration';
        if (queryObject.category) {
            query['category'] = queryObject.category 
        }
    
        return { query, skip, pageSize };
    }
}
