import { Field, ObjectType } from "type-graphql";
import { Organization } from "./Organization";

@ObjectType()
export class Room {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  organization!: Organization;
}
