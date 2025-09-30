import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-agents",
  name: "List Agents",
  description: "List all agents in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#list_all_agents)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    email: {
      type: "string",
      label: "Email",
      description: "Filter results by email address",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "Filter results by mobile number",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Filter results by phone number",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Filter results by state",
      options: [
        "fulltime",
        "occasional",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        freshdesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.freshdesk.getPaginatedResources({
      fn: this.freshdesk.listAgents,
      args: {
        $,
        params: {
          email: this.email,
          mobile: this.mobile,
          phone: this.phone,
          state: this.state,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully listed ${results.length} agent${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
