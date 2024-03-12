import sendcloud from "../../sendcloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendcloud-create-a-parcel",
  name: "Create a Parcel",
  description: "Creates a new parcel under your Sendcloud API credentials. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/parcels/operations/create-a-parcel)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sendcloud,
    parcelData: {
      propDefinition: [
        sendcloud,
        "parcelData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendcloud.createParcel(this.parcelData);
    $.export("$summary", `Successfully created parcel with ID: ${response.id}`);
    return response;
  },
};
