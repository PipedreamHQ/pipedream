import tick from "../../tick.app.mjs";

export default {
  name: "Create Client",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "tick-create-client",
  description: "Creates a client. [See docs here](https://github.com/tick/tick-api/blob/master/sections/clients.md#create-client)",
  type: "action",
  props: {
    tick,
    name: {
      label: "Name",
      description: "The name of the client",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.tick.createClient({
      $,
      data: {
        name: this.name,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created client with id ${response.id}`);
    }

    return response;
  },
};
