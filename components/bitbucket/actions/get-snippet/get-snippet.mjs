import common from "../common/common.mjs";
const { bitbucket } = common.props;

export default {
  key: "bitbucket-get-snippet",
  name: "Get snippet",
  description: "Get a snippet. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-snippets/#api-snippets-workspace-encoded-id-get)",
  version: "0.1.2",
  type: "action",
  props: {
    ...common.props,
    snippetId: {
      propDefinition: [
        bitbucket,
        "snippets",
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

    $.export("summary", "Successfully retrieved snippet");

    return response;
  },
};
