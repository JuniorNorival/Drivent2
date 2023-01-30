import { prisma } from '@/config';
import { Ticket, TicketStatus } from '@prisma/client';

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
const ticketsRepository = {
  createTicket,
  findAllTicketsTypes,
  findTicketbyUser,
  findTicketsTypeByTypeId,
  findTicketById,
};
export default ticketsRepository;
