import cliento from "../../cliento.app.mjs";

export default {
  key: "cliento-get-slots",
  name: "Get Slots",
  description: "Fetch available slots for the given service, resource and dates. [See the documentation](https://developers.cliento.com/docs/rest-api#fetch-slots)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cliento,
    fromDate: {
      propDefinition: [
        cliento,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        cliento,
        "toDate",
      ],
    },
    resourceIds: {
      propDefinition: [
        cliento,
        "resourceIds",
      ],
    },
    serviceIds: {
      propDefinition: [
        cliento,
        "serviceIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cliento.fetchSlots({
      $,
      params: {
        fromDate: this.fromDate,
        toDate: this.toDate,
        resIds: this.resourceIds.join(),
        srvIds: this.serviceIds.join(),
      },
    });
    if (response?.length) {
      $.export("$summary", `Successfully fetched ${response.length} slot${response.length === 1
        ? ""
        : "s"}`);
    }
    return response;
  },
};
