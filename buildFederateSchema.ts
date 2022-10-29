import { GraphQLSchema, specifiedDirectives } from 'graphql';
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { addResolversToSchema } from '@graphql-tools/schema';
import { IResolvers, printSchemaWithDirectives } from '@graphql-tools/utils';
import {
  buildSchema,
  BuildSchemaOptions,
  createResolversMap,
} from 'type-graphql';

/**
 * Given a schema, patches the query, mutation and subscription to work in federation
 */
export const patchSchemaExtensions = (schema: GraphQLSchema): string =>
  printSchemaWithDirectives(schema)
    .replace('type Query {', 'type Query @extends {')
    .replace('type Mutation {', 'type Mutation @extends {')
    .replace('type Subscription {', 'type Subscription @extends {');

export async function buildFederatedSchema(
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
  referenceResolvers?: IResolvers,
) {
  const schema = await buildSchema({
    ...options,
    directives: [...specifiedDirectives, ...(options.directives || [])],
    skipCheck: true,
  });

  const federatedSchema = buildSubgraphSchema({
    typeDefs: gql(printSchemaWithDirectives(schema)),
    resolvers: createResolversMap(schema) as any,
  });

  if (referenceResolvers) {
    addResolversToSchema({
      schema: federatedSchema,
      resolvers: referenceResolvers,
    });
  }
  return { schema: federatedSchema };
}
