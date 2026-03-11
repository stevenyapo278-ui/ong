import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../prisma';

const MERCH_URL = (process.env.GENIUSPAY_BASE_URL || "https://pay.genius.ci/api/v1/merchant") + "/payments";

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { amount, description, customer } = req.body;

        // amount is required, in XOF
        if (!amount || amount < 100) {
            return res.status(400).json({ message: "Montant invalide (minimum 100 XOF)" });
        }

        // 1. Save pending donation in database
        const donation = await prisma.donation.create({
            data: {
                amount: parseInt(amount.toString(), 10),
                description: description || 'Donation pour l\'ONG',
                customerName: customer?.name || null,
                customerEmail: customer?.email || null,
                customerPhone: customer?.phone || null,
                status: 'pending'
            }
        });

        // 2. Call Genius Pay API to initiate payment
        const payload = {
            amount: parseInt(amount.toString(), 10),
            currency: 'XOF',
            description: description || 'Participation aux projets de l\'ONG Bien Vivre Ici',
            metadata: { 
                donationId: donation.id 
            },
            customer: {
                name: customer?.name || 'Donateur Anonyme',
                email: customer?.email || 'contact@ongbienvivreici.org',
                phone: customer?.phone || '+22500000000'
            },
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/espace-donateur?status=success&donationId=${donation.id}`,
            error_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/espace-donateur?status=error&donationId=${donation.id}`,
        };

        const response = await axios.post(MERCH_URL, payload, {
            headers: {
                'X-API-Key': process.env.GENIUSPAY_API_KEY || 'pk_test_placeholder',
                'X-API-Secret': process.env.GENIUSPAY_API_SECRET || 'sk_test_placeholder',
                'Content-Type': 'application/json'
            }
        });


        if (response.data.success) {
            // Update reference and status
            await prisma.donation.update({
                where: { id: donation.id },
                data: { 
                    reference: response.data.data.reference 
                }
            });

            return res.status(201).json({
                checkout_url: response.data.data.checkout_url || response.data.data.payment_url,
                reference: response.data.data.reference
            });
        } else {
            return res.status(500).json({ message: "Erreur lors de l'initiation du paiement Genius Pay" });
        }
    } catch (error: any) {
        console.error('Error creating payment:', error.response?.data || error.message);
        res.status(500).json({ 
            message: "Une erreur est survenue lors de la tentative de paiement.",
            details: error.response?.data?.message || error.message
        });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        
        console.log('Received Webhook from Genius Pay:', JSON.stringify(payload, null, 2));

        if (payload.event === 'payment.success' || payload.event === 'payment.completed') {
            const { reference, id: transaction_id, metadata } = payload.data;
            const donationId = metadata?.donationId;

            if (donationId) {
                await prisma.donation.update({
                    where: { id: donationId },
                    data: {
                        status: 'success',
                        transactionId: transaction_id?.toString() || reference
                    }
                });
                console.log(`Donation ${donationId} marked as SUCCESS`);
            }
        } else if (payload.event === 'payment.failed') {
             const { metadata } = payload.data;
             const donationId = metadata?.donationId;
             if (donationId) {
                 await prisma.donation.update({
                     where: { id: donationId },
                     data: { status: 'error' }
                 });
                 console.log(`Donation ${donationId} marked as FAILED`);
             }
        }

        // Always return 200 to Genius Pay
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ message: "Internal server error during webhook processing" });
    }
};
