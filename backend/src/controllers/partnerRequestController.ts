import { Request, Response } from 'express';
import prisma from '../prisma';

export const createPartnerRequest = async (req: Request, res: Response) => {
  try {
    const { organization, contactName, email, phone, message } = req.body;

    if (!organization || !contactName || !email) {
      return res.status(400).json({ message: 'Organisation, nom de contact et email sont requis' });
    }

    const request = await prisma.partnerRequest.create({
      data: {
        organization,
        contactName,
        email,
        phone,
        message
      }
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la demande', error });
  }
};

export const getPartnerRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.partnerRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes', error });
  }
};

export const updatePartnerRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await prisma.partnerRequest.update({
      where: { id },
      data: { status }
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la demande', error });
  }
};

export const deletePartnerRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.partnerRequest.delete({
      where: { id }
    });
    res.json({ message: 'Demande supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la demande', error });
  }
};
