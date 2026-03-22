import { Router } from 'express';
import { createPayment, handleWebhook, getDonations } from '../controllers/paymentController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Endpoint to initiate a payment
router.post('/initiate', createPayment);

// Endpoint for Genius Pay webhooks
router.post('/webhook', handleWebhook);

// Admin: list all donations
router.get('/', protect, authorize('ADMIN'), getDonations);

export default router;
