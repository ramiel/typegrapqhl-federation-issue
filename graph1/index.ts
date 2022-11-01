import "reflect-metadata";

import { buildFederatedSchema } from "../buildFederateSchema";
import { OrganizationResolver, data as orgData } from "./OrganizationResolver";
import { Organization } from "./Organization";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

export const startGraph1 = async () => {
  const schema = await buildFederatedSchema(
    {
      resolvers: [OrganizationResolver],
      orphanedTypes: [Organization],
    },
    {
      Organization: {
        __resolveReference: async (ref: Pick<Organization, "id">) => {
          console.log("this is not called!");
          console.log(ref);
          return orgData.find((o) => o.id === ref.id);
        },
      },
    }
  );
  const server = new ApolloServer({
    schema,
    includeStacktraceInErrorResponses: true,
    logger: {
      info: console.log,
      debug: console.log,
      warn: console.warn,
      error: console.error,
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 5001 },
  });
  return url;
};

// start();
