import tuya from "../../tuya.app.mjs";

export default {
  key: "tuya-list-devices",
  name: "List Devices",
  description: "Get a list of devices associated with a home. [See the documentation](https://developer.tuya.com/en/docs/cloud/d7ee73aadb?id=Kawfjer0wkt2a)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tuya,
    userId: {
      propDefinition: [
        tuya,
        "userId",
      ],
    },
    homeId: {
      propDefinition: [
        tuya,
        "homeId",
        (c) => ({
          userId: c.userId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.homeId
      ? await this.tuya.listHomeDevices({
        homeId: this.homeId,
      })
      : await this.tuya.listUserDevices({
        userId: this.userId,
      });
    if (response?.result?.length) {
      $.export("$summary", `Found ${response.result.length} device${response.result.length === 1
        ? ""
        : "s"}`);
    }
    return response;
  },
};
