import BaseRepository from './BaseRepository';
import OrderModel, { IOrder, OrderStatus } from '../models/Order.model';

class OrderRepository extends BaseRepository<IOrder> {
  constructor() { super(OrderModel); }

  async findByBuyer(buyerId: string, skip: number, limit: number) {
    return this.model.find({ buyer: buyerId }).populate('book').populate('address').skip(skip).limit(limit).sort({ createdAt: -1 });
  }

  async findBySeller(sellerId: string, skip: number, limit: number) {
    return this.model.find().populate({ path: 'book', match: { owner: sellerId } }).populate('buyer', 'name email').skip(skip).limit(limit).sort({ createdAt: -1 });
  }

  async findWithDetails(id: string) {
    return this.model.findById(id).populate('book').populate('buyer', 'name email').populate('address');
  }

  async updateStatus(id: string, status: OrderStatus, timestamps: Record<string, Date> = {}) {
    return this.model.findByIdAndUpdate(id, { status, ...timestamps }, { new: true });
  }
}

export default new OrderRepository();
