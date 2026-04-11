import { Router, Request, Response } from 'express';
import { getEstimatedDelivery } from '../utils/pincodeEstimate';
import ExamTagModel from '../models/ExamTag.model';
import ApiResponse from '../utils/ApiResponse';

const router = Router();

router.get('/delivery/estimate', (req: Request, res: Response) => {
  const { sellerPincode, buyerPincode } = req.query as Record<string, string>;
  const result = getEstimatedDelivery(sellerPincode, buyerPincode);
  return ApiResponse.success(res, result);
});

router.get('/exam-tags', async (_req: Request, res: Response) => {
  const tags = await ExamTagModel.find({ countryCode: 'IN' }).sort({ category: 1 });
  return ApiResponse.success(res, tags);
});

router.get('/currency/rates', async (_req: Request, res: Response) => {
  try {
    const r = await fetch('https://api.frankfurter.app/latest?from=INR');
    const data = await r.json();
    return ApiResponse.success(res, data);
  } catch {
    return ApiResponse.error(res, 'Failed to fetch currency rates', 503);
  }
});

export default router;
