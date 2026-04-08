import OrderRepository from '../repositories/OrderRepository';
import BookRepository from '../repositories/BookRepository';
import CartRepository from '../repositories/CartRepository';
import AddressRepository from '../repositories/AddressRepository';
import AppError from '../utils/AppError';
import { getEstimatedDelivery } from '../utils/pincodeEstimate';
import { paginate, paginatedResponse } from '../utils/pagination';
import { OrderStatus } from '../models/Order.model';

const STATUS_TIMESTAMPS: Record<string, string> = {
  shipped:          'shippedAt',
  out_for_delivery: 'outForDeliveryAt',
  delivered:        'deliveredAt',
  cancelled:        'cancelledAt',
};

class OrderService {
  async placeOrder(buyerId: string, bookId: string, addressId: string) {
    const [book, address] = await Promise.all([
      BookRepository.findById(bookId),
      AddressRepository.findById(addressId),
    ]);
    if (!book)    throw new AppError('Book not found', 404);
    if (!address) throw new AppError('Address not found', 404);
    if (book.status !== 'available') throw new AppError('Book is no longer available', 400);
    if (book.owner.toString() === buyerId) throw new AppError('Cannot order your own book', 400);

    const delivery = getEstimatedDelivery(book.sellerPincode, address.pincode);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + delivery.days);

    const order = await OrderRepository.create({
      buyer: buyerId as never,
      book: bookId as never,
      address: addressId as never,
      totalAmount: book.price,
      status: 'pending',
      estimatedDelivery: estimatedDate,
    });

    await Promise.all([
      BookRepository.updateStatus(bookId, 'sold'),
      CartRepository.findItem(buyerId, bookId).then((item) => item && CartRepository.delete(item._id.toString())),
    ]);

    return order;
  }

  async getBuyerOrders(buyerId: string, query: Record<string, string>) {
    const { page, limit, skip } = paginate(query);
    const data  = await OrderRepository.findByBuyer(buyerId, skip, limit);
    const total = await OrderRepository.count({ buyer: buyerId });
    return paginatedResponse(data, total, page, limit);
  }

  async getSellerOrders(sellerId: string, query: Record<string, string>) {
    const { page, limit, skip } = paginate(query);
    const data  = await OrderRepository.findBySeller(sellerId, skip, limit);
    const total = data.length;
    return paginatedResponse(data, total, page, limit);
  }

  async getOrder(id: string, userId: string) {
    const order = await OrderRepository.findWithDetails(id);
    if (!order) throw new AppError('Order not found', 404);
    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const timestamps: Record<string, Date> = {};
    const tsKey = STATUS_TIMESTAMPS[status];
    if (tsKey) timestamps[tsKey] = new Date();
    return OrderRepository.updateStatus(orderId, status, timestamps);
  }

  async cancel(orderId: string, userId: string) {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    if (!['pending', 'payment_confirmed'].includes(order.status))
      throw new AppError('Order cannot be cancelled at this stage', 400);

    await Promise.all([
      OrderRepository.updateStatus(orderId, 'cancelled', { cancelledAt: new Date() }),
      BookRepository.updateStatus(order.book.toString(), 'available'),
    ]);
  }
}

export default new OrderService();
