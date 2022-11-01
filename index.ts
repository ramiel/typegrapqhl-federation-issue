import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";

import { startGraph1 } from "./graph1";
import { startGraph2 } from "./graph2";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const startGateway = async () => {
  await startGraph1();
  await startGraph2();

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "graph1", url: "http://localhost:5001/graphql" },
        { name: "graph2", url: "http://localhost:5002/graphql" },

        // { name: "accounts", url: "http://localhost:3001" },
        // { name: "reviews", url: "http://localhost:3002" },
        // { name: "products", url: "http://localhost:3003" },
        // { name: "inventory", url: "http://localhost:3004" },
      ],
    }),
  });

  const server = new ApolloServer({
    gateway,
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
  });
  console.log(url);
};

startGateway();
