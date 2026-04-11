import { Response, NextFunction } from 'express';
import AddressService from '../services/AddressService';
import ApiResponse from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

class AddressController {
  async getAddresses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await AddressService.getAddresses(req.user!.id);
      return ApiResponse.success(res, addresses);
    } catch (err) { next(err); }
  }

  async addAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await AddressService.addAddress(req.user!.id, req.body);
      return ApiResponse.created(res, address);
    } catch (err) { next(err); }
  }

  async setDefault(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await AddressService.setDefault(req.params.id, req.user!.id);
      return ApiResponse.success(res, address);
    } catch (err) { next(err); }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await AddressService.remove(req.params.id, req.user!.id);
      return ApiResponse.success(res, null, 'Address deleted');
    } catch (err) { next(err); }
  }
}

export default new AddressController();
