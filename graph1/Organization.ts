import { Directive, Field, ObjectType } from "type-graphql";

@Directive('@key(fields: "id")')
@ObjectType()
export class Organization {
  @Field()
  id!: string;

  @Field()
  name!: string;
}
