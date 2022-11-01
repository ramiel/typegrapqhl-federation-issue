import { Query, Resolver } from "type-graphql";
import { Organization } from "./Organization";

export const data: Array<Organization> = [
  {
    id: "1",
    name: "Org 1",
  },
  {
    id: "2",
    name: "Org 2",
  },
  {
    id: "3",
    name: "Org 2",
  },
];

@Resolver(() => Organization)
export class OrganizationResolver {
  @Query(() => [Organization])
  organizations() {
    return data;
  }
}
