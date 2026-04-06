import BaseRepository from './BaseRepository';
import BookModel, { IBook } from '../models/Book.model';
import { FilterQuery } from 'mongoose';

interface BookFilters {
  q?: string;
  category?: string;
  type?: string;
  condition?: string;
  examTag?: string;
  minPrice?: string;
  maxPrice?: string;
  status?: string;
}

class BookRepository extends BaseRepository<IBook> {
  constructor() { super(BookModel); }

  buildFilter(filters: BookFilters): FilterQuery<IBook> {
    const query: FilterQuery<IBook> = {};
    if (filters.status)    query.status = filters.status;
    else                   query.status = 'available';
    if (filters.category)  query.category = filters.category;
    if (filters.type)      query.type = filters.type;
    if (filters.condition) query.condition = filters.condition;
    if (filters.examTag)   query.examTags = filters.examTag;
    if (filters.q)         query.$text = { $search: filters.q };
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
    }
    return query;
  }

  async search(filters: BookFilters, skip: number, limit: number) {
    const query = this.buildFilter(filters);
    const [data, total] = await Promise.all([
      this.model.find(query).populate('owner', 'name avgRating').populate('examTags').skip(skip).limit(limit).sort({ createdAt: -1 }),
      this.model.countDocuments(query),
    ]);
    return { data, total };
  }

  async findByOwner(ownerId: string, skip: number, limit: number) {
    return this.model.find({ owner: ownerId }).skip(skip).limit(limit).sort({ createdAt: -1 });
  }

  async findWithOwner(id: string) {
    return this.model.findById(id).populate('owner', 'name email avgRating countryCode').populate('examTags');
  }

  async updateStatus(id: string, status: string) {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export default new BookRepository();
