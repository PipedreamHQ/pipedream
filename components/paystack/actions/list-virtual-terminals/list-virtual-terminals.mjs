import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-list-virtual-terminals",
  name: "List Virtual Terminals",
  description: "List Virtual Terminals on your integration. [See the documentation](https://paystack.com/docs/api/virtual-terminal/#list)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paystack,
    maxResults: {
      propDefinition: [
        paystack,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.paystack.paginate({
      resourceFn: this.paystack.listVirtualTerminals,
      args: {
        $,
      },
      max: this.maxResults,
    });
    const terminals = [];
    for await (const terminal of results) {
      terminals.push(terminal);
    }

    $.export("$summary", `Retrieved ${terminals.length} virtual terminal${terminals.length === 1
      ? ""
      : "s"}`);
    return terminals;
  },
};
