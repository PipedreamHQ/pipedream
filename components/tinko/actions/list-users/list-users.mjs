import app from "../../tinko.app.mjs";

export default {
  key: "tinko-list-users",
  name: "List Users",
  description: "List the users (attendants) of the company."
    + " Use the returned `id` as the attendant in **Send Message**, **Transfer Chat**, **Close Chat** or **List Chats**."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/users/#listar-usu%C3%A1rios)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      type: "string",
      label: "Search",
      description: "Return only users whose name or email contains this value, e.g. `nathan`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const users = await this.app.getPaginatedResults({
      fn: this.app.listUsers,
      args: {
        $,
        params: {
          search: this.search,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Found ${users.length} user${users.length === 1
      ? ""
      : "s"}`);
    return users;
  },
};
