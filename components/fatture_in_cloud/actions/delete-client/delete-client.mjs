import fatture_in_cloud from "../../fatture_in_cloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fatture_in_cloud-delete-client",
  name: "Delete Client",
  description: "Removes a client from the list. [See the documentation](https://developers.fattureincloud.it/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fatture_in_cloud,
    companyid: {
      propDefinition: [
        fatture_in_cloud,
        "companyid",
      ],
    },
    clientid: {
      propDefinition: [
        fatture_in_cloud,
        "clientid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fatture_in_cloud.removeClient({
      companyid: this.companyid,
      clientid: this.clientid,
    });
    $.export("$summary", `Successfully removed client with ID ${this.clientid}`);
    return response;
  },
};
