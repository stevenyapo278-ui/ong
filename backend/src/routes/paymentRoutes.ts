import { Router } from 'express';
import { createPayment, handleWebhook } from '../controllers/paymentController';

const router = Router();

// Endpoint to initiate a payment
router.post('/initiate', createPayment);

// Endpoint for Genius Pay webhooks
router.post('/webhook', handleWebhook);

export default router;
