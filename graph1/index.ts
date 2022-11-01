import "reflect-metadata";

import { buildFederatedSchema } from "../buildFederateSchema";
import { OrganizationResolver, data as orgData } from "./OrganizationResolver";
import { Organization } from "./Organization";
import { ApolloServer } from "apollo-server";

export const startGraph1 = async () => {
  const { schema } = await buildFederatedSchema(
    {
      resolvers: [OrganizationResolver],
      orphanedTypes: [Organization],
    },
    {
      Organization: {
        __resolveReference(ref: Pick<Organization, "id">) {
          console.log("this is not called!");
          console.log(ref);
          return orgData.find((o) => o.id === ref.id);
        },
      },
    }
  );
  const server = new ApolloServer({ schema });

  return server.listen({ port: 5000 });
};

// start();
