import gitlab from "../../gitlab.app.mjs";
import {
  paginate,
  summarizeDiff,
} from "../../common/utils.mjs";

export default {
  key: "gitlab-get-merge-request-diffs",
  name: "Get Merge Request Diffs",
  description: "List the file-level changes in a merge request — each changed file's path, whether it was added, deleted or renamed, and its unified diff. This is the tool to call before reviewing, approving or commenting on a merge request: the `new_path` values and the line numbers inside each `diff` hunk are what **Create Merge Request Comment** and **Create Merge Request Review** need to anchor an inline comment. Large merge requests can be trimmed with **Paths** (only files under the given prefixes) and **Max Files**. Watch for `too_large: true` or `collapsed: true` on a file — GitLab omits or shortens those diffs, so do not conclude a file is unchanged. Use **Get Merge Request** for metadata and merge readiness, and **Get Merge Request Commits** for the commit history. [See the documentation](https://docs.gitlab.com/api/merge_requests/#list-merge-request-diffs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectIdStatic",
      ],
    },
    mergeRequestIid: {
      propDefinition: [
        gitlab,
        "mergeRequestIid",
      ],
    },
    paths: {
      type: "string[]",
      label: "Paths",
      description: "Return only files whose path starts with one of these prefixes, e.g. `src/api/` or `app/models/user.rb`. Filtering happens after fetching, so this trims the response but not the number of requests. Leave blank for every changed file.",
      optional: true,
    },
    maxFiles: {
      propDefinition: [
        gitlab,
        "maxResults",
      ],
      label: "Max Files",
      description: "Maximum number of changed files to return in total, paginating as needed. Defaults to `100`. Lower it for a merge request that touches hundreds of files.",
    },
    includeDiffText: {
      type: "boolean",
      label: "Include Diff Text",
      description: "Whether to include each file's unified `diff` text. Defaults to `true`. Set to `false` for a cheap list of *which* files changed, without the contents.",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      items, truncated,
    } = await paginate({
      requestFn: (params) => this.gitlab.listMergeRequestDiffs(
        this.projectId,
        this.mergeRequestIid,
        {
          $,
          params,
        },
      ),
      maxResults: this.maxFiles,
    });

    const prefixes = this.paths?.filter(Boolean);
    const matched = prefixes?.length
      ? items.filter((file) => prefixes.some((prefix) =>
        file.new_path?.startsWith(prefix) || file.old_path?.startsWith(prefix)))
      : items;

    const files = matched.map((file) => {
      const projected = summarizeDiff(file);
      if (!this.includeDiffText) {
        delete projected.diff;
      }
      return projected;
    });

    const unavailable = matched.filter((file) => file.too_large || file.collapsed).length;
    const notes = [
      truncated && "capped at Max Files, there may be more",
      unavailable && `${unavailable} diff${unavailable === 1
        ? ""
        : "s"} too large or collapsed`,
      prefixes?.length && `filtered from ${items.length} changed files`,
    ].filter(Boolean);

    $.export("$summary", `Retrieved ${files.length} changed file${files.length === 1
      ? ""
      : "s"} for merge request !${this.mergeRequestIid} in ${this.projectId}${notes.length
      ? ` (${notes.join("; ")})`
      : ""}`);

    return files;
  },
};
