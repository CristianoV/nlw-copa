import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "CintiaS",
      email: "cintia.sc.samara22@gmail.com",
      avatarUrl: "https://pps.whatsapp.net/v/t61.24694-24/291491130_513866290492122_2707326616529028128_n.jpg?ccb=11-4&oh=01_AdSVU4q89aLsJ2fRT7Ebt_mV_kV36ZBlIxZ7Vgy_TPjY8A&oe=638DE360",
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
      date: '2022-12-02T12:00:00.201Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-12-03T12:00:00.201Z',
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