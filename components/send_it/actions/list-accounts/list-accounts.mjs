import sendIt from "../../send_it.app.mjs";

export default {
  key: "send_it-list-accounts",
  name: "List Connected Accounts",
  description: "Get a list of connected social media accounts. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    sendIt,
  },
  async run({ $ }) {
    const response = await this.sendIt.listAccounts({ $ });
    const totalCount = response.accounts?.length || 0;
    const connectedCount = response.accounts?.filter((a) => a.connected).length || 0;
    $.export("$summary", `Found ${connectedCount} connected account(s) out of ${totalCount} total`);
    return response;
  },
};
