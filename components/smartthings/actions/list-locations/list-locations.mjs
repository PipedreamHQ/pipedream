import smartthings from "../../smartthings.app.mjs";

export default {
  key: "smartthings-list-locations",
  name: "List Locations",
  description: "Lists all locations available to the connected SmartThings account. [See the documentation](https://developer.smartthings.com/docs/api/public#tag/Locations/operation/listLocations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartthings,
  },
  async run({ $ }) {
    const { items = [] } = await this.smartthings.listLocations({
      $,
    });
    $.export("$summary", `Successfully retrieved ${items.length} location${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
