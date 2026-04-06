import BaseRepository from './BaseRepository';
import CartItemModel, { ICartItem } from '../models/CartItem.model';

class CartRepository extends BaseRepository<ICartItem> {
  constructor() { super(CartItemModel); }

  async findByUser(userId: string) {
    return this.model.find({ user: userId }).populate('book').sort({ addedAt: -1 });
  }

  async findItem(userId: string, bookId: string) {
    return this.model.findOne({ user: userId, book: bookId });
  }

  async clearByUser(userId: string) {
    return this.model.deleteMany({ user: userId });
  }
}

export default new CartRepository();
