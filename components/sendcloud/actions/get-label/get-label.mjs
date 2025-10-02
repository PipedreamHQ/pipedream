import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-get-label",
  name: "Get Label",
  description: "Retrieve a label by parcel ID. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/labels/operations/get-a-label)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    parcelId: {
      propDefinition: [
        app,
        "parcelId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      parcelId,
    } = this;

    const response = await app.getLabel({
      $,
      parcelId,
    });

    $.export("$summary", `Successfully retrieved label for parcel \`${parcelId}\``);

    return response;
  },
};

