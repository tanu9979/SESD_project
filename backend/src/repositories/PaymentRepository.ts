import BaseRepository from './BaseRepository';
import PaymentModel, { IPayment } from '../models/Payment.model';

class PaymentRepository extends BaseRepository<IPayment> {
  constructor() { super(PaymentModel); }

  async findByOrder(orderId: string) {
    return this.model.findOne({ order: orderId });
  }

  async markSuccess(orderId: string, transactionId: string) {
    return this.model.findOneAndUpdate({ order: orderId }, { status: 'success', transactionId, paidAt: new Date() }, { new: true });
  }
}

export default new PaymentRepository();
