import fattureInCloud from "../../fatture_in_cloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fatture_in_cloud-list-clients",
  name: "List Clients",
  description: "Returns a list of all clients. [See the documentation](https://developers.fattureincloud.it/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fattureInCloud,
    companyid: {
      propDefinition: [
        fattureInCloud,
        "companyid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fattureInCloud.listClients({
      companyid: this.companyid,
    });
    $.export("$summary", `Successfully retrieved ${response.length} clients`);
    return response;
  },
};
