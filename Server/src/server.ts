import Fastify from "fastify";

async function bootstrap() {
    const fastify = Fastify({
        logger: true
    });
    
    fastify.get("/", async (_request, _reply) => {
        return { hello: "world" };
    });

    await fastify.listen({port: 3001});
}

bootstrap();