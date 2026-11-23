import app from "../../tinko.app.mjs";

export default {
  key: "tinko-list-channels",
  name: "List Channels",
  description: "List the channels of the company (WhatsApp numbers, Instagram accounts, site chat and others) with their type and connection status."
    + " Use the returned `id` as the channel in **Send Message**, **Transfer Chat** or **List Templates**."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/channels/#listar-canais)",
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
      label: "Name Contains",
      description: "Return only channels whose name contains this value, e.g. `Support`.",
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
    const channels = await this.app.getPaginatedResults({
      fn: this.app.listChannels,
      args: {
        $,
        params: {
          search: this.search,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Found ${channels.length} channel${channels.length === 1
      ? ""
      : "s"}`);
    return channels;
  },
};
