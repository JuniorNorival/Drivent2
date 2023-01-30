import { notFoundError, unauthorizedError } from '@/errors';
import { PaymentData } from '@/protocols';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository, { NewPayment } from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { prisma, Ticket } from '@prisma/client';
import { verify } from 'crypto';
import { BAD_REQUEST } from 'http-status';

async function createPayment(payment: PaymentData) {
  const ticket = await verifyTicket(payment.ticketId);

  if (!payment.cardData) {
    throw BAD_REQUEST;
  }

  const ticketType = await ticketsRepository.findTicketsTypeByTypeId(ticket.ticketTypeId);

  const newPayment: NewPayment = {
    ticketId: payment.ticketId,
    value: ticketType.price,
    cardIssuer: payment.cardData.issuer,
    cardLastDigits: payment.cardData.number.toString().slice(-4),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const insertedPayment = await paymentsRepository.createPayment(newPayment);
  if (!insertedPayment) {
    return;
  }

  await ticketsRepository.updateTicketStatusById(ticket.id);

  return insertedPayment;
}
async function getPayment(ticketId: number) {
  await verifyTicket(ticketId);

  const paymentData = await paymentsRepository.findPaymentById(ticketId);

  return paymentData;
}
async function verifyTicket(ticketId: number) {
  const ticket = await ticketsRepository.findTicketById(ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

const paymentService = {
  createPayment,
  getPayment,
};

export default paymentService;
