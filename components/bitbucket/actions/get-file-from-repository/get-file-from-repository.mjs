import base from "../common/base.mjs";
const { bitbucket } = base.props;

export default {
  key: "bitbucket-get-file-from-repository",
  name: "Get File From Repository",
  description: "Gets the actual file contents of a download artifact and not the artifact's metadata. [See docs here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-downloads/#api-repositories-workspace-repo-slug-downloads-filename-get)",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...base.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repository",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    filename: {
      label: "Filename",
      description: "Name of the file to download.",
      type: "string",
    },
  },
  async run({ $ }) {
    const {
      workspaceId,
      repositoryId,
      filename,
    } = this;

    const response = this.bitbucket.getRepositoryFile({
      workspaceId,
      repositoryId,
      filename,
    });

    $.export("$summary", "Successfully retrieved repository file");

    return response;
  },
};
