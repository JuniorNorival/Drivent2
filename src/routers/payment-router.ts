import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPaymentSchema } from '@/schemas';
import { createPayment, getPaymentByTicketId } from '@/controllers/payment-controller';
const paymentRouter = Router();

paymentRouter
  .all('/*', authenticateToken)
  .post('/process', validateBody(createPaymentSchema), createPayment)
  .get('/', getPaymentByTicketId);

export { paymentRouter };
