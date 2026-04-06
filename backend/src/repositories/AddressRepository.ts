import BaseRepository from './BaseRepository';
import AddressModel, { IAddress } from '../models/Address.model';

class AddressRepository extends BaseRepository<IAddress> {
  constructor() { super(AddressModel); }

  async findByUser(userId: string) {
    return this.model.find({ user: userId }).sort({ isDefault: -1 });
  }

  async clearDefault(userId: string) {
    return this.model.updateMany({ user: userId }, { isDefault: false });
  }

  async setDefault(id: string, userId: string) {
    await this.clearDefault(userId);
    return this.model.findByIdAndUpdate(id, { isDefault: true }, { new: true });
  }
}

export default new AddressRepository();
