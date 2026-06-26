import github from "../../github.app.mjs";

export default {
  key: "github-get-repository-content",
  name: "Get Repository Content",
  description: "Read a file's contents or list a directory in a repository. For a file, the base64 payload is decoded for you and returned as plain text in the `content` field. For a directory, returns the list of entries (name, path, type). Provide the repository as an `owner/repo` string and the `path` to the file or directory (omit `path` for the repo root). Use **Get Repository** first if you need to know the default branch. [See the documentation](https://docs.github.com/en/rest/repos/contents#get-repository-content)",
  version: "1.0.0",
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
        "repoFullnameStatic",
      ],
    },
    path: {
      label: "Path",
      description: "The file path or directory to retrieve, e.g. `src/index.js` or `docs/`. Defaults to the repository's root directory.",
      type: "string",
      default: "",
      optional: true,
    },
    ref: {
      label: "Ref",
      description: "The branch name, tag, or commit SHA to read from. Defaults to the repository's default branch (usually `main` or `master`).",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const response = await this.github.getRepoContent({
      repoFullname,
      path: this.path,
      ...(this.ref && {
        params: {
          ref: this.ref,
        },
      }),
    });

    // Directory listing — response is an array of entries.
    if (Array.isArray(response)) {
      $.export("$summary", `Listed ${response.length} entries in ${this.path || "the repository root"}`);
      return response;
    }

    // Single file — decode the base64 payload into readable text.
    const decoded = response.encoding === "base64" && response.content
      ? Buffer.from(response.content, "base64").toString("utf-8")
      : response.content;

    $.export("$summary", `Retrieved file ${response.path}`);

    return {
      ...response,
      content: decoded,
    };
  },
};
