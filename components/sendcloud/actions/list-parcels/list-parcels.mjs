import sendcloud from "../../sendcloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendcloud-list-parcels",
  name: "List Parcels",
  description: "Retrieves a list of all the parcels under your API credentials. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/parcels/operations/list-parcels)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sendcloud,
  },
  async run({ $ }) {
    const parcels = await this.sendcloud.listParcels();
    $.export("$summary", "Successfully retrieved the list of parcels");
    return parcels;
  },
};
