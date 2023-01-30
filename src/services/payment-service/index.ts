import { notFoundError, unauthorizedError } from '@/errors';
import { PaymentData } from '@/protocols';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository, { NewPayment } from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { Ticket } from '@prisma/client';

async function createPayment(userId: number, payment: PaymentData) {
  const ticket = await verifyTicket(payment.ticketId);
  await verifyUserTicket(userId, ticket);

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
async function getPayment(userId: number, ticketId: number) {
  const ticket = await verifyTicket(ticketId);
  await verifyUserTicket(userId, ticket);
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
async function verifyUserTicket(userId: number, ticket: Ticket) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (ticket.enrollmentId !== enrollment.id) {
    throw unauthorizedError();
  }
}

const paymentService = {
  createPayment,
  getPayment,
};

export default paymentService;
