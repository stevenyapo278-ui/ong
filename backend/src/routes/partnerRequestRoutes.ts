import { Router } from 'express';
import { 
  createPartnerRequest, 
  getPartnerRequests, 
  updatePartnerRequestStatus, 
  deletePartnerRequest 
} from '../controllers/partnerRequestController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/', createPartnerRequest);
router.get('/', protect, authorize('ADMIN', 'EDITOR'), getPartnerRequests);
router.put('/:id/status', protect, authorize('ADMIN', 'EDITOR'), updatePartnerRequestStatus);
router.delete('/:id', protect, authorize('ADMIN'), deletePartnerRequest);

export default router;
