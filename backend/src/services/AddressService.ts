import AddressRepository from '../repositories/AddressRepository';
import AppError from '../utils/AppError';

class AddressService {
  async getAddresses(userId: string) {
    return AddressRepository.findByUser(userId);
  }

  async addAddress(userId: string, data: Record<string, unknown>) {
    return AddressRepository.create({ ...data, user: userId } as never);
  }

  async setDefault(id: string, userId: string) {
    const address = await AddressRepository.findById(id);
    if (!address) throw new AppError('Address not found', 404);
    if (address.user.toString() !== userId) throw new AppError('Forbidden', 403);
    return AddressRepository.setDefault(id, userId);
  }

  async remove(id: string, userId: string) {
    const address = await AddressRepository.findById(id);
    if (!address) throw new AppError('Address not found', 404);
    if (address.user.toString() !== userId) throw new AppError('Forbidden', 403);
    return AddressRepository.delete(id);
  }
}

export default new AddressService();
