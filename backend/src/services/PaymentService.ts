import PaymentRepository from '../repositories/PaymentRepository';
import OrderRepository from '../repositories/OrderRepository';
import AppError from '../utils/AppError';

class PaymentService {
  async initiatePayment(orderId: string, method: 'card' | 'upi' | 'cod') {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    const payment = await PaymentRepository.create({
      order: orderId as never,
      amount: order.totalAmount,
      method,
      status: 'pending',
    });
    return { paymentId: payment._id, amount: order.totalAmount, method };
  }

  async confirmPayment(orderId: string, transactionId: string) {
    const payment = await PaymentRepository.markSuccess(orderId, transactionId);
    if (!payment) throw new AppError('Payment not found', 404);

    await OrderRepository.updateStatus(orderId, 'payment_confirmed', { confirmedAt: new Date() });
    return payment;
  }
}

export default new PaymentService();
