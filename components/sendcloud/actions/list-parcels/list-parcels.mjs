import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-list-parcels",
  name: "List Parcels",
  description: "Retrieves a list of all the parcels under your API credentials. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/parcels/operations/list-parcels)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listParcels({
      $,
    });

    $.export("$summary", "Successfully retrieved the list of parcels");

    return response;
  },
};
