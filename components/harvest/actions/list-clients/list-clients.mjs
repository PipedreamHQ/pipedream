import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "harvest-list-clients",
  name: "List Clients",
  description: `List clients in the Harvest account, automatically following pagination up to ${constants.MAX_AUTO_PAGINATE_RECORDS} clients. Use this to discover client IDs for **Create Invoice**, **Create Project**, and other tools that accept a Client ID. Example: to find InGen Corp's client ID, call with no filters and look for the client named "InGen Corp" in the results. [See the documentation](https://help.getharvest.com/api-v2/clients-api/clients/clients/#list-all-clients).`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Only return active or inactive clients.",
    },
    updatedSince: {
      propDefinition: [
        harvest,
        "updatedSince",
      ],
    },
  },
  async run({ $ }) {
    const clients = [];
    const pages = this.harvest.listClientsPaginated({
      page: 1,
      accountId: this.accountId,
      isActive: this.isActive,
      updatedSince: this.updatedSince,
    });
    for await (const client of pages) {
      clients.push(client);
      if (clients.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
    }
    const count = clients.length;
    $.export("$summary", `Successfully retrieved ${count} client${count === 1
      ? ""
      : "s"}`);
    return clients;
  },
};
