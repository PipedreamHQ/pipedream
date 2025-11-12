import app from "../../cisco_meraki.app.mjs";

export default {
  key: "cisco_meraki-create-organization",
  name: "Create Organization",
  description: "Creates a new organization. [See the docs](https://developer.cisco.com/meraki/api/#!create-organization).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the organization",
    },
  },
  methods: {
    createOrganization(args = {}) {
      return this.app.create({
        path: "/organizations",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.createOrganization({
      step,
      data: {
        name: this.name,
      },
    });

    step.export("$summary", `Successfully created organization with ID \`${response.id}\``);

    return response;
  },
};
