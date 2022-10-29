import { Query, Resolver } from "type-graphql";
import { Room } from "./Room";

@Resolver(() => Room)
export class RoomResolver {
  @Query(() => [Room])
  rooms() {
    return [
      { id: "1", name: "room 1", organization: { id: 1 } },
      { id: "2", name: "room 2", organization: { id: 2 } },
    ];
  }
}
