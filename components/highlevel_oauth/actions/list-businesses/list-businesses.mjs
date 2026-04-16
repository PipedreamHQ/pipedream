import common from "../../common/base.mjs";

export default {
  ...common,
  key: "highlevel_oauth-list-businesses",
  name: "List Businesses",
  description: "Retrieves all businesses for a location in HighLevel. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/businesses/get-businesses-by-location)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    locationId: {
      propDefinition: [
        common.props.app,
        "locationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listBusinesses({
      $,
      params: {
        locationId: this.locationId ?? this.app.getLocationId(),
      },
    });

    const count = response?.businesses?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} business${count === 1
      ? ""
      : "es"}`);
    return response;
  },
};
