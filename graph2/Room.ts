import { Directive, Field, ID, ObjectType } from "type-graphql";
import { Organization } from "./Organization";

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Room {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  organization!: Organization;
}
