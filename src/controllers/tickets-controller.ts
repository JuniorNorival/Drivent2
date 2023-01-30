import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;
  try {
    const ticketCreated = await ticketsService.createTicket(userId, ticketTypeId);

    return res.status(httpStatus.CREATED).send(ticketCreated);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  }
}
export async function getTicketByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const userTicket = await ticketsService.getTicketFromUser(userId);

    return res.status(httpStatus.OK).send(userTicket);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  }
}

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();

    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  }
}
