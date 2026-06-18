import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    phone?: string;
  };
}

export const verifyFirebaseToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing Bearer Token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      phone: decodedToken.phone_number,
    };
    next();
  } catch (error) {
    console.error('Error verifying ID Token:', error);
    return res.status(403).json({ error: 'Unauthorized: Invalid Token' });
  }
};
