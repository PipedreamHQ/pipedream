import { ConfigurationError } from "@pipedream/platform";
import gitlab from "../../gitlab.app.mjs";
import { buildPosition } from "../../common/utils.mjs";

export default {
  key: "gitlab-create-merge-request-comment",
  name: "Create Merge Request Comment",
  description: "Post a comment on a merge request. It works in three modes, chosen by which props you set: leave **File Path** and **Discussion ID** blank for a plain comment on the merge request as a whole; set **File Path** plus a line number to open an inline thread anchored to that line of the diff; or set **Discussion ID** to reply inside an existing thread. Use **Get Merge Request Diffs** first to get valid file paths and line numbers, and **List Merge Request Discussions** to get a **Discussion ID** to reply to. Line numbers follow GitLab's diff rules: for a line the merge request **adds** or leaves unchanged, pass **New Line**; for a line it **removes**, pass **Old Line**; for an unchanged context line, pass both. Getting that wrong is the usual cause of a rejected inline comment. To post several review comments at once, and optionally approve in the same step, use **Create Merge Request Review** instead. [See the documentation](https://docs.gitlab.com/api/discussions/#create-new-merge-request-thread)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    body: {
      type: "string",
      label: "Body",
      description: "The comment text. Supports GitLab-flavored Markdown, so code blocks, lists and suggestion blocks all work.",
    },
    discussionId: {
      propDefinition: [
        gitlab,
        "discussionId",
      ],
      optional: true,
      description: "Set this to reply inside an existing thread instead of starting a new one. Get it from **List Merge Request Discussions**. Cannot be combined with **File Path**.",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "Set this to anchor the comment to a line of the diff — the file's path after the change, exactly as `new_path` reports it in **Get Merge Request Diffs** (e.g. `src/api/client.py`). Leave blank for a comment on the merge request as a whole.",
      optional: true,
    },
    oldFilePath: {
      type: "string",
      label: "Old File Path",
      description: "The file's path *before* the change, as `old_path` reports it in **Get Merge Request Diffs**. Only needed when the merge request renames the file — GitLab anchors a comment on a renamed file with both paths. Defaults to **File Path**.",
      optional: true,
    },
    newLine: {
      type: "integer",
      label: "New Line",
      description: "Line number in the **new** version of the file. Use this for a line the merge request adds, and together with **Old Line** for an unchanged context line. Required with **File Path** unless **Old Line** is given.",
      optional: true,
    },
    oldLine: {
      type: "integer",
      label: "Old Line",
      description: "Line number in the **old** version of the file. Use this for a line the merge request removes, and together with **New Line** for an unchanged context line.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.discussionId && this.filePath) {
      throw new ConfigurationError("Set either `Discussion ID` (to reply in an existing thread) or `File Path` (to start an inline thread), not both.");
    }

    if (this.discussionId) {
      const response = await this.gitlab.createMergeRequestDiscussionNote(
        this.projectId,
        this.mergeRequestIid,
        this.discussionId,
        {
          $,
          data: {
            body: this.body,
          },
        },
      );
      $.export("$summary", `Replied in thread ${this.discussionId} on merge request !${this.mergeRequestIid} in ${this.projectId}`);
      return response;
    }

    if (this.filePath) {
      const mergeRequest = await this.gitlab.getMergeRequest(
        this.projectId,
        this.mergeRequestIid,
        {
          $,
        },
      );
      const diffRefs = mergeRequest.diff_refs;

      const position = buildPosition({
        new_path: this.filePath,
        old_path: this.oldFilePath,
        new_line: this.newLine,
        old_line: this.oldLine,
      }, diffRefs);

      const response = await this.gitlab.createMergeRequestDiscussion(
        this.projectId,
        this.mergeRequestIid,
        {
          $,
          data: {
            body: this.body,
            position,
          },
        },
      );
      const line = this.newLine ?? this.oldLine;
      $.export("$summary", `Opened an inline thread on ${this.filePath}:${line} in merge request !${this.mergeRequestIid} (${this.projectId})`);
      return response;
    }

    const response = await this.gitlab.createMergeRequestNote(
      this.projectId,
      this.mergeRequestIid,
      {
        $,
        data: {
          body: this.body,
        },
      },
    );
    $.export("$summary", `Commented on merge request !${this.mergeRequestIid} in ${this.projectId}`);
    return response;
  },
};
