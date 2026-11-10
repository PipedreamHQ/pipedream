import smartthings from "../../smartthings.app.mjs";

export default {
  key: "smartthings-list-rooms",
  name: "List Rooms",
  description: "Lists the rooms in a SmartThings location. [See the documentation](https://developer.smartthings.com/docs/api/public#tag/Rooms/operation/listRooms)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartthings,
    locationId: {
      propDefinition: [
        smartthings,
        "locationId",
      ],
    },
  },
  async run({ $ }) {
    const { items = [] } = await this.smartthings.listRooms({
      $,
      locationId: this.locationId,
    });
    $.export("$summary", `Successfully retrieved ${items.length} room${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
