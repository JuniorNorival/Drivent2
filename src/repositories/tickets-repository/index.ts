import { prisma } from '@/config';
import { TicketStatus } from '@prisma/client';

async function findAllTicketsTypes() {
  return await prisma.ticketType.findMany();
}

async function findTicketbyUser(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}

async function createTicket(enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentId,
      status: TicketStatus.RESERVED,
    },
  });
}
async function findTicketsTypeByTypeId(id: number) {
  return prisma.ticketType.findFirst({
    where: { id },
  });
}

async function findTicketById(id: number) {
  return prisma.ticket.findFirst({ where: { id } });
}

async function updateTicketStatusById(ticketId: number) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: TicketStatus.PAID,
      updatedAt: new Date(),
    },
  });
}
const ticketsRepository = {
  createTicket,
  findAllTicketsTypes,
  findTicketbyUser,
  findTicketsTypeByTypeId,
  findTicketById,
  updateTicketStatusById,
};
export default ticketsRepository;
