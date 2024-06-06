import samsara from "../../samsara.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "samsara-create-address",
  name: "Create Address",
  description: "Adds a new address to the organization. The user must provide the necessary props such as formatted address, geofence, and name. [See the documentation](https://developers.samsara.com/reference/createaddress)",
  version: "0.0.1",
  type: "action",
  props: {
    samsara,
    formattedAddress: samsara.propDefinitions.formattedAddress,
    geofence: samsara.propDefinitions.geofence,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the address.",
    },
  },
  async run({ $ }) {
    const response = await samsara.createAddress({
      formattedAddress: this.formattedAddress,
      geofence: this.geofence,
      name: this.name,
    });
    $.export("$summary", `Successfully created address with name ${this.name}`);
    return response;
  },
};
