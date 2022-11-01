import { Query, Resolver } from "type-graphql";
import { Organization } from "./Organization";
import { Room } from "./Room";

@Resolver(() => Room)
export class RoomResolver {
  @Query(() => [Room])
  rooms() {
    return [
      createRoom({
        id: "1",
        name: "room 1",
        organization: createOrganization({ id: "1" }),
      }),
      createRoom({
        id: "2",
        name: "room 2",
        organization: createOrganization({ id: "1" }),
      }),
    ];
  }
}

function createRoom(roomData: Partial<Room>) {
  return Object.assign(new Room(), roomData);
}

function createOrganization(orgData: Partial<Organization>) {
  return Object.assign(new Organization(), orgData);
}
