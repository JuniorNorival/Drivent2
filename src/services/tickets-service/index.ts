import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketTypes() {
  const allTicketTypes = await ticketsRepository.findAllTicketsTypes();
  return allTicketTypes;
}

async function getTicketFromUser(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }
  const userTicket = await ticketsRepository.findTicketbyUser(enrollment.id);

  if (!userTicket) {
    throw notFoundError();
  }
  return userTicket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const insertedTicket = await ticketsRepository.createTicket(enrollment.id, ticketTypeId);

  if (!insertedTicket) {
    throw notFoundError();
  }
  const ticketType = await ticketsRepository.findTicketsTypeByTypeId(insertedTicket.ticketTypeId);
  return { ...insertedTicket, TicketType: ticketType };
}
const ticketsService = {
  getTicketTypes,
  getTicketFromUser,
  createTicket,
};

export default ticketsService;
