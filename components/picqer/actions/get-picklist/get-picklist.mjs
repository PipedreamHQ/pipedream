import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-get-picklist",
  name: "Get Picklist",
  description: "Get a picklist in Picqer. [See the documentation](https://picqer.com/en/api/picklists#h-get-single-picklist)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    picqer,
    picklistId: {
      propDefinition: [
        picqer,
        "picklistId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.picqer.getPicklist({
      $,
      picklistId: this.picklistId,
    });

    $.export("$summary", `Successfully retrieved picklist ${this.picklistId}`);
    return response;
  },
};
