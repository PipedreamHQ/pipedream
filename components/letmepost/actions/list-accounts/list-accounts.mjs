import app from "../../letmepost.app.mjs";

export default {
  key: "letmepost-list-accounts",
  name: "List Accounts",
  description: "List the social accounts connected to your organization. [See the documentation](https://letmepost.dev/docs/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: { app },
  async run({ $ }) {
    const { data } = await this.app.listAccounts({ $ });

    $.export("$summary", `Successfully retrieved ${data.length} connected account(s)`);

    return data;
  },
};
