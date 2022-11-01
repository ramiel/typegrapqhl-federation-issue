import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { useApolloFederation } from "@envelop/apollo-federation";
import { createYoga } from "graphql-yoga";

import { startGraph1 } from "./graph1";
import { startGraph2 } from "./graph2";
import { ApolloServer } from "apollo-server";

const startGateway = async () => {
  await startGraph1();
  await startGraph2();

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "graph1", url: "http://localhost:5000/graphql" },
        { name: "graph2", url: "http://localhost:5001/graphql" },
      ],
    }),
  });

  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    schema,
    executor,
    debug: true,
  });

  const { url } = await server.listen({ port: 5002 });
  console.log(url);
};

startGateway();
