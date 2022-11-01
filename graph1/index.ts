import "reflect-metadata";

import { buildFederatedSchema } from "../buildFederateSchema";
import { OrganizationResolver, data as orgData } from "./OrganizationResolver";
import { Organization } from "./Organization";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const organizationReferenceResolver = async (
  ref: Pick<Organization, "id">,
  _ctx: any,
  _info: any
): Promise<Organization | null> => {
  return orgData.find((o) => o.id === ref.id) || null;
};

export const startGraph1 = async () => {
  const schema = await buildFederatedSchema(
    {
      resolvers: [OrganizationResolver],
      orphanedTypes: [Organization],
    },
    {
      Organization: {
        __resolveReference: organizationReferenceResolver,
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
