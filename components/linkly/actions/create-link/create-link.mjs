import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-create-link",
  name: "Create Link",
  description: "Creates a new Linkly link using the provided URL. [See the documentation](https://app.linklyhq.com/swaggerui#/API/create_or_update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    linkly,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to shorten",
    },
  },
  async run({ $ }) {
    const response = await this.linkly.createLink({
      data: {
        url: this.url,
        workspace_id: this.linkly.workspaceId(),
      },
      $,
    });
    $.export("$summary", `Successfully created Linkly link for URL ${this.url}.`);
    return response;
  },
};
