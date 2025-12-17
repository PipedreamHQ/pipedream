import github from "../../github.app.mjs";

export default {
  key: "github-get-repository-content",
  name: "Get Repository Content",
  description: "Get the content of a file or directory in a specific repository. [See the documentation](https://docs.github.com/en/rest/repos/contents#get-repository-content)",
  version: "0.1.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    path: {
      label: "Path",
      description: "The file path or directory to retrieve. Defaults to the repository's root directory.",
      type: "string",
      default: "",
      optional: true,
    },
    mediaType: {
      label: "Media Type",
      description: "The media type of the response. [See the documentation](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content) for more information.",
      type: "string",
      options: [
        {
          value: "application/vnd.github.raw+json",
          label: "Returns the raw file contents for files and symlinks",
        },
        {
          value: "application/vnd.github.html+json",
          label: "Returns the file contents in HTML",
        },
        {
          value: "application/vnd.github.object+json",
          label: "Returns the contents in a consistent object format regardless of the content type",
        },
      ],
      optional: true,
    },
    branch: {
      propDefinition: [
        github,
        "branch",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
      description:
        "The branch to use. Defaults to the repository's default branch (usually `main` or `master`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.github.getRepoContent({
      repoFullname: this.repoFullname,
      path: this.path,
      mediaType: this.mediaType,
      params: {
        ref: this.branch?.split?.("/")[0],
      },
    });

    $.export("$summary", "Successfully retrieved repository content.");

    return response;
  },
};
