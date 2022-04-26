import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag, TagDocument } from './entities/tag.entity';


@Injectable()
export class TagsService {

  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) { }

  async create(title: string) {
    const newTag = new this.tagModel({title});
    await newTag.save();
    return newTag;
  }
  async getTagsByTitle(titles: string) {
    const titleArray = titles.split(',');
    if(!titleArray.length) return null; 
    let quries = []
    for(let title of titleArray) {
      quries.push({title})
    }
    return this.tagModel.find({$or: quries});
  }
  
  async getTagsIds(titles: string) {
    const titleArray = titles.split(',');
    if(!titleArray.length) return null; 
    let ids = []
    for(let title of titleArray) {
      const tag = await this.tagModel.findOne({title});
      if(tag) ids.push(tag._id);
      else {
        const newTag = await this.create(title);
        ids.push(newTag._id);
      }
    }
    return ids;
  }
  


  async getAllMatchingTags(tagTitles?: string[], search?: string) {
    if(!search && !tagTitles) return null;
    let quries = [];
    if(search && search.length){
      quries.push({title: new RegExp(search, 'i')})
    } 
    if(tagTitles && tagTitles.length) {
      quries.push({
        title: {$in: tagTitles}
      })
    }
    return this.tagModel.find({$or: quries}).select('_id title');
  }
  
  async getTagById(_id: Types.ObjectId) {
    return this.tagModel.findOne({_id});
  }
  
  async searchInTags(queryText: string) {
    if(queryText && queryText.length > 0) {
      const query = new RegExp(queryText, 'i');
      return this.tagModel.find({ title: query }).limit(25);
    }
    return this.tagModel.find({});
  }

}
