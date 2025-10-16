import app from "../../cisco_meraki.app.mjs";

export default {
  key: "cisco_meraki-get-network",
  name: "Get Network",
  description: "Gets a network. [See the docs](https://developer.cisco.com/meraki/api/#!get-network).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    orgId: {
      propDefinition: [
        app,
        "orgId",
      ],
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
  },
  methods: {
    getNetwork({
      networkId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/networks/${networkId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getNetwork({
      step,
      networkId: this.networkId,
    });

    step.export("$summary", `Successfully retrieved network with ID \`${response.id}\``);

    return response;
  },
};
