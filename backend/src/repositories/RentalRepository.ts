import BaseRepository from './BaseRepository';
import RentalModel, { IRental } from '../models/Rental.model';

class RentalRepository extends BaseRepository<IRental> {
  constructor() { super(RentalModel); }

  async findByRenter(renterId: string, skip: number, limit: number) {
    return this.model.find({ renter: renterId }).populate('book').skip(skip).limit(limit).sort({ createdAt: -1 });
  }

  async markReturned(id: string) {
    return this.model.findByIdAndUpdate(id, { status: 'returned', returnedDate: new Date() }, { new: true });
  }

  async findOverdue() {
    return this.model.find({ status: 'active', endDate: { $lt: new Date() } }).populate('book renter');
  }
}

export default new RentalRepository();
