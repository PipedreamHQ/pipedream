import smartthings from "../../smartthings.app.mjs";

export default {
  key: "smartthings-list-rooms",
  name: "List Rooms",
  description: "Lists the rooms in a SmartThings location. [See the documentation](https://developer.smartthings.com/docs/api/public#tag/Rooms/operation/listRooms)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
    const items = [];
    const results = this.smartthings.paginate({
      $,
      resourceFn: (opts) => this.smartthings.listRooms({
        $,
        locationId: this.locationId,
        ...opts,
      }),
    });
    for await (const item of results) {
      items.push(item);
    }
    $.export("$summary", `Successfully retrieved ${items.length} room${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
