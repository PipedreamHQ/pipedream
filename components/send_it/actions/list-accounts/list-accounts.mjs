import sendIt from "../../send_it.app.mjs";

export default {
  key: "send_it-list-accounts",
  name: "List Connected Accounts",
  description: "Get a list of connected social media accounts. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "1.0.0",
  type: "action",
  props: {
    sendIt,
  },
  async run({ $ }) {
    const response = await this.sendIt.listAccounts({ $ });
    const connectedCount = response.accounts?.filter((a) => a.connected).length || 0;
    $.export("$summary", `Found ${connectedCount} connected account(s)`);
    return response;
  },
};
