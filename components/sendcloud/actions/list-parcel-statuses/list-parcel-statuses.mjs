import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-list-parcel-statuses",
  name: "List Parcel Statuses",
  description: "List parcel statuses. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/parcel-statuses/operations/list-parcel-statuses)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listParcelStatuses({
      $,
    });

    $.export("$summary", "Successfully listed parcel statuses");

    return response;
  },
};

