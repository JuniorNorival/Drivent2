import { prisma } from '@/config';
import { Payment } from '@prisma/client';

async function cretePayment(payment: NewPayment) {
  return prisma.payment.create({ data: payment });
}

async function findPaymentById(ticketId: number) {
  return prisma.payment.findFirst({ where: { ticketId } });
}

const paymentRepository = {
  cretePayment,
  findPaymentById,
};
export type NewPayment = Omit<Payment, 'id'>;

export default paymentRepository;
