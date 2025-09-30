import app from "../../sendcloud.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sendcloud-bulk-pdf-label-printing",
  name: "Bulk PDF Label Printing",
  description: "Bulk PDF label printing. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/labels/operations/create-a-label)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    parcels: {
      type: "integer[]",
      label: "Parcel IDs",
      description: "IDs of parcels to print labels. Example: [1, 2, 3]",
      propDefinition: [
        app,
        "parcelId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      parcels,
    } = this;

    const response = await app.bulkPDFLabelPrinting({
      $,
      data: {
        label: {
          parcels: utils.parseArray(parcels),
        },
      },
    });

    $.export("$summary", "Successfully triggered bulk label print");

    return response;
  },
};

