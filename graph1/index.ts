import "reflect-metadata";

import fastifyFactory, { FastifyReply, FastifyRequest } from "fastify";
import { createYoga } from "graphql-yoga";
import { buildFederatedSchema } from "../buildFederateSchema";
import { OrganizationResolver } from "./OrganizationResolver";
import { Organization } from "./Organization";

export const startGraph1 = async () => {
  const server = fastifyFactory();
  const { schema } = await buildFederatedSchema(
    {
      resolvers: [OrganizationResolver],
      orphanedTypes: [Organization],
    },
    {
      Organization: {
        __resolveReference(ref: any) {
          console.log("this is not called!");
          console.log(ref);
          return {
            id: 1,
            name: "org from reference",
          };
        },
      },
    }
  );

  const yoga = createYoga<{
    req: FastifyRequest;
    reply: FastifyReply;
  }>({
    schema,
  });
  server.route({
    url: "/graphql",
    method: ["GET", "POST", "OPTIONS"],
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      const response = await yoga.handleNodeRequest(req, {
        req,
        reply,
      });
      response.headers.forEach((value, key) => {
        if (
          key === "content-type" &&
          value.startsWith("application/graphql-response+json")
        ) {
          reply.header("content-type", "application/json; charset=utf-8");
          return;
        }
        reply.header(key, value);
      });
      reply.status(response.status);
      reply.send(response.body);
      return reply;
    },
  });

  return server.listen({ port: 5000 });
};

// start();
