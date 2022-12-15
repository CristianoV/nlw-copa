import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async (request, reply) => {
    const count = await prisma.guess.count();
    return { count };
  });

  fastify.post(
    '/pools/:poolId/games/:gameId/guesses',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });
      const createGuessParams = z.object({
        poolId: z.string(),
        gameId: z.string(),
      });

      const { poolId, gameId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant) {
        return reply.status(400).send({
          error: "You're not allowed to create a guess inside this pool.",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return reply.status(400).send({
          error: 'You already send a guess for this game on this pool.',
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(400).send({
          error: 'Game not Found.',
        });
      }

      if (game.date < new Date()) {
        return reply.status(400).send({
          error: 'You cannot send a guesses after the game date.',
        });
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return reply.status(201).send();
    }
  );
}
