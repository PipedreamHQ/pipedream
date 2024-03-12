import sendcloud from "../../sendcloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendcloud-update-a-parcel",
  name: "Update a Parcel",
  description: "Updates a parcel under your API credentials. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/parcels/operations/update-a-parcel)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sendcloud,
    parcelId: {
      propDefinition: [
        sendcloud,
        "parcelId",
      ],
    },
    parcelData: {
      propDefinition: [
        sendcloud,
        "parcelData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendcloud.updateParcel(this.parcelId, this.parcelData);
    $.export("$summary", `Successfully updated parcel with ID ${this.parcelId}`);
    return response;
  },
};
