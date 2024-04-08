import app from "../../simplebackups.app.mjs";

export default {
  name: "List Servers",
  version: "0.0.1",
  key: "list-servers",
  description: "List servers.",
  props: {
    app,
  },
  type: "action",

  async run({ $ }) {
    const { data } = await this.app.listServers();

    $.export("$summary", `Found ${data.length} server(s).`);

    return {
      servers: data,
    };
  },
};
