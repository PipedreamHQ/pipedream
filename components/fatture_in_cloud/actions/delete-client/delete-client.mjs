import fattureInCloud from "../../fatture_in_cloud.app.mjs";

export default {
  key: "fatture_in_cloud-delete-client",
  name: "Delete Client",
  description: "Removes a client from the list. [See the documentation](https://developers.fattureincloud.it/api-reference)",
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
    clientId: {
      propDefinition: [
        fattureInCloud,
        "clientId",
        ({ companyId }) => ({
          companyId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fattureInCloud.removeClient({
      $,
      companyId: this.companyId,
      clientId: this.clientId,
    });
    $.export("$summary", `Successfully removed client with ID ${this.clientId}`);
    return response;
  },
};
