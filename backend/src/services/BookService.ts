import BookRepository from '../repositories/BookRepository';
import AppError from '../utils/AppError';
import { paginate, paginatedResponse } from '../utils/pagination';

class BookService {
  async getAll(query: Record<string, string>) {
    const { page, limit, skip } = paginate(query);
    const { data, total } = await BookRepository.search(query, skip, limit);
    return paginatedResponse(data, total, page, limit);
  }

  async getById(id: string) {
    const book = await BookRepository.findWithOwner(id);
    if (!book) throw new AppError('Book not found', 404);
    return book;
  }

  async create(ownerId: string, data: Record<string, unknown>) {
    // Mongoose casts string to ObjectId at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return BookRepository.create({ ...data, owner: ownerId as any });
  }

  async update(id: string, ownerId: string, data: Record<string, unknown>) {
    const book = await BookRepository.findById(id);
    if (!book) throw new AppError('Book not found', 404);
    if (book.owner.toString() !== ownerId) throw new AppError('Forbidden', 403);
    return BookRepository.update(id, data);
  }

  async remove(id: string, ownerId: string) {
    const book = await BookRepository.findById(id);
    if (!book) throw new AppError('Book not found', 404);
    if (book.owner.toString() !== ownerId) throw new AppError('Forbidden', 403);
    return BookRepository.delete(id);
  }

  async getMyListings(ownerId: string, query: Record<string, string>) {
    const { skip, limit, page } = paginate(query);
    const data = await BookRepository.findByOwner(ownerId, skip, limit);
    const total = await BookRepository.count({ owner: ownerId });
    return paginatedResponse(data, total, page, limit);
  }
}

export default new BookService();
