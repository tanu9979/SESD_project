import RentalRepository from '../repositories/RentalRepository';
import BookRepository from '../repositories/BookRepository';
import AppError from '../utils/AppError';
import { paginate, paginatedResponse } from '../utils/pagination';

class RentalService {
  async rentBook(renterId: string, data: { bookId: string; startDate: string; endDate: string; addressId?: string }) {
    const book = await BookRepository.findById(data.bookId);
    if (!book) throw new AppError('Book not found', 404);
    if (!['rent', 'both'].includes(book.type)) throw new AppError('Book is not available for rent', 400);
    if (book.status !== 'available') throw new AppError('Book is not available', 400);
    if (book.owner.toString() === renterId) throw new AppError('Cannot rent your own book', 400);

    const start = new Date(data.startDate);
    const end   = new Date(data.endDate);
    const days  = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) throw new AppError('Invalid rental dates', 400);

    const rental = await RentalRepository.create({
      renter: renterId as never,
      book: data.bookId as never,
      address: data.addressId as never,
      startDate: start,
      endDate: end,
      dailyRate: book.price,
      totalAmount: book.price * days,
    });

    await BookRepository.updateStatus(data.bookId, 'rented');
    return rental;
  }

  async getMyRentals(renterId: string, query: Record<string, string>) {
    const { page, limit, skip } = paginate(query);
    const data  = await RentalRepository.findByRenter(renterId, skip, limit);
    const total = await RentalRepository.count({ renter: renterId });
    return paginatedResponse(data, total, page, limit);
  }

  async returnBook(rentalId: string, renterId: string) {
    const rental = await RentalRepository.findById(rentalId);
    if (!rental) throw new AppError('Rental not found', 404);
    if (rental.renter.toString() !== renterId) throw new AppError('Forbidden', 403);
    if (rental.status !== 'active') throw new AppError('Rental already returned', 400);

    const [updated] = await Promise.all([
      RentalRepository.markReturned(rentalId),
      BookRepository.updateStatus(rental.book.toString(), 'available'),
    ]);
    return updated;
  }
}

export default new RentalService();
