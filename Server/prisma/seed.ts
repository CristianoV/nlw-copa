import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "CristianoV",
      email: "cristianoviieira@gmail.com",
      avatarUrl: "https://github.com/CristianoV.png",
    }
  });

  const poll = await prisma.pool.create({
    data: {
      title: "Example poll",
      code: "BOL123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  // const participants = await prisma.participant.create({
  //   data: {
  //     poolId: poll.id,
  //     userId: user.id,
  //   }
  // })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.201Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-03T12:00:00.201Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: poll.id,
              }
            }
          }
        }
      }
    }
  })

}

main()