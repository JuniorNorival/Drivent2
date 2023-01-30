import { AuthenticatedRequest } from '@/middlewares';
import { PaymentData } from '@/protocols';
import paymentsService from '@/services/payment-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const paymentData = req.body as PaymentData;
  if (!paymentData.ticketId || !paymentData.cardData) return res.status(httpStatus.BAD_REQUEST).send({});
  try {
    const paymentResponse = await paymentsService.createPayment(userId, paymentData);

    return res.status(httpStatus.OK).send(paymentResponse);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { ticketId } = req.query;
    if (!ticketId) return res.status(httpStatus.BAD_REQUEST).send({});
    const payment = await paymentsService.getPayment(userId, Number(ticketId));

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}
