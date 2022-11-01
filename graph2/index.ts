import "reflect-metadata";

import { buildFederatedSchema } from "../buildFederateSchema";
import { RoomResolver } from "./RoomResolver";
import { Organization } from "./Organization";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

export const startGraph2 = async () => {
  const schema = await buildFederatedSchema({
    resolvers: [RoomResolver],
    orphanedTypes: [Organization],
  });
  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 5002 },
  });
  return url;
};
