import "reflect-metadata";

import { buildFederatedSchema } from "../buildFederateSchema";
import { RoomResolver } from "./RoomResolver";
import { Organization } from "./Organization";
import { ApolloServer } from "apollo-server";

export const startGraph2 = async () => {
  const schema = await buildFederatedSchema({
    resolvers: [RoomResolver],
    orphanedTypes: [Organization],
  });

  const server = new ApolloServer({ schema });

  return server.listen({ port: 5001 });
};
