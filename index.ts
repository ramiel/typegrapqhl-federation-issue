import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { useApolloFederation } from "@envelop/apollo-federation";
import { createYoga } from "graphql-yoga";

import { startGraph1 } from "./graph1";
import { startGraph2 } from "./graph2";

const startGateway = async () => {
  await startGraph1();
  await startGraph2();
  const app = Fastify();

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "graph1", url: "http://localhost:5000/graphql" },
        { name: "graph2", url: "http://localhost:5001/graphql" },
      ],
    }),
  });

  await gateway.load();
  const yoga = createYoga<{
    req: FastifyRequest;
    reply: FastifyReply;
  }>({
    graphqlEndpoint: "/graphql",
    graphiql: {
      defaultQuery: `query {
        rooms {
          id
          name
          organization {
            id
            ## Uncomment the following to get the error
            # name
          }
        }
      }`,
    },
    plugins: [
      useApolloFederation({
        gateway,
      }),
    ],
  });
  app.route({
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

  await app.listen({ port: 5002 });
  console.log("http://localhost:5002/graphql");
};

startGateway();
