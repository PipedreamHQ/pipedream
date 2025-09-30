import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-get-link",
  name: "Get Link",
  description: "Fetches a previously produced Linkly link. [See the documentation](https://app.linklyhq.com/swaggerui#/API/show)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    linkly,
    linkId: {
      propDefinition: [
        linkly,
        "linkId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linkly.getLink({
      linkId: this.linkId,
      params: {
        workspace_id: this.linkly.workspaceId(),
      },
      $,
    });
    $.export("$summary", `Successfully fetched link with ID: ${this.linkId}`);
    return response;
  },
};
