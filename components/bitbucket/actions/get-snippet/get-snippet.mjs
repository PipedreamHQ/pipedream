import base from "../common/base.mjs";
const { bitbucket } = base.props;

export default {
  key: "bitbucket-get-snippet",
  name: "Get snippet",
  description: "Get a snippet. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-snippets/#api-snippets-workspace-encoded-id-get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...base.props,
    snippetId: {
      propDefinition: [
        bitbucket,
        "snippet",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      workspaceId,
      snippetId,
    } = this;

    const response = await this.bitbucket.getSnippet({
      workspaceId,
      snippetId,
    }, $);

    $.export("$summary", "Successfully retrieved snippet");

    return response;
  },
};
