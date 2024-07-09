import fattureInCloud from "../../fatture_in_cloud.app.mjs";

export default {
  key: "fatture_in_cloud-list-clients",
  name: "List Clients",
  description: "Returns a list of all clients. [See the documentation](https://developers.fattureincloud.it/api-reference)",
  version: "0.0.1",
  type: "action",
  props: {
    fattureInCloud,
    companyId: {
      propDefinition: [
        fattureInCloud,
        "companyId",
      ],
    },
  },
  async run({ $ }) {
    const response = this.fattureInCloud.paginate({
      $,
      fn: this.fattureInCloud.listClients,
      companyId: this.companyId,
    });

    const responseArray = [];

    for await (const client of response) {
      responseArray.push(client);
    }

    $.export("$summary", `Successfully retrieved ${responseArray.length} clients`);
    return responseArray;
  },
};
