import tuya from "../../tuya.app.mjs";

export default {
  key: "tuya-list-homes",
  name: "List Homes",
  description: "Based on the user ID, query the list of homes where the specified user belongs. [See the documentation](https://developer.tuya.com/en/docs/cloud/f5dd40ed14?id=Kawfjh9hpov1n)",
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
  },
  async run({ $ }) {
    const response = await this.tuya.listHomes({
      userId: this.userId,
    });
    if (response?.result?.length) {
      $.export("$summary", `Found ${response.result.length} home${response.result.length === 1
        ? ""
        : "s"}`);
    }
    return response;
  },
};
