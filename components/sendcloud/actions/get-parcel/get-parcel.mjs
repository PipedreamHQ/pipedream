import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-get-parcel",
  name: "Get Parcel",
  description: "Retrieve a parcel by ID. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/parcels/operations/get-a-parcel)",
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

    const response = await app.getParcel({
      $,
      parcelId,
    });

    $.export("$summary", `Successfully retrieved parcel with ID \`${response.parcel?.id}\``);

    return response;
  },
};

