import app from "../../simplebackups.app.mjs";

export default {
  name: "List Servers",
  version: "0.0.1",
  key: "simplebackups-list-servers",
  description: "List all servers providers added to your SimpleBackups account. [See the documentation](https://simplebackups.docs.apiary.io/#/reference/servers/list-servers)",
  props: {
    app,
  },
  type: "action",

  async run({ $ }) {
    const { data } = await this.app.listServers($);

    $.export("$summary", `Found ${data.length} server(s).`);

    return {
      servers: data,
    };
  },
};
