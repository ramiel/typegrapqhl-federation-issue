# Issue

This repository is aimed to reproduce a problem with type-grapqhl and a federation.

I'm trying to reproduce my actual setup in a more concise way.

We have:    
Graph1: a subgraphq serving entity Organization.   
Graph2: a subgraph serving entity Room that also refers Organization.   
A gateway built with Graphql Yoga (the result is the same with apollo server).   

Launch everything with `yarn start` or `npm start`

If you open graphiql at [http://localhost:5002/graphql] a query should already be present

To reproduce the problem launch the query (below the same query):

```graphql
query {
  rooms {
    id
    name
    organization {
      id
      name
    }
  }
}
```

The gateway correctly tries to resolve Organization on graph1, but the `__resolveReference` method is never called
