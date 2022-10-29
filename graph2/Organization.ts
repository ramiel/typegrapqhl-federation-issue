import { Directive, Field, ObjectType } from "type-graphql";

@Directive("@extends")
@Directive(`@key(fields: "id")`)
@ObjectType()
export class Organization {
  @Directive("@external")
  @Field()
  id!: string;
}
