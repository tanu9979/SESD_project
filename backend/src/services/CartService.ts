import CartRepository from '../repositories/CartRepository';
import BookRepository from '../repositories/BookRepository';
import AppError from '../utils/AppError';

class CartService {
  async getCart(userId: string) {
    return CartRepository.findByUser(userId);
  }

  async addToCart(userId: string, bookId: string) {
    const book = await BookRepository.findById(bookId);
    if (!book) throw new AppError('Book not found', 404);
    if (book.status !== 'available') throw new AppError('Book is not available', 400);
    if (book.owner.toString() === userId) throw new AppError('Cannot add your own book to cart', 400);

    const existing = await CartRepository.findItem(userId, bookId);
    if (existing) throw new AppError('Book already in cart', 400);

    return CartRepository.create({ user: userId as never, book: bookId as never });
  }

  async removeFromCart(itemId: string, userId: string) {
    const item = await CartRepository.findById(itemId);
    if (!item) throw new AppError('Cart item not found', 404);
    if (item.user.toString() !== userId) throw new AppError('Forbidden', 403);
    return CartRepository.delete(itemId);
  }
}

export default new CartService();
