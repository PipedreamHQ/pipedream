import { ConfigurationError } from "@pipedream/platform";
import gitlab from "../../gitlab.app.mjs";
import { buildPosition } from "../../common/utils.mjs";

const COMMENT = "comment";
const APPROVE = "approve";

export default {
  key: "gitlab-create-merge-request-review",
  name: "Create Merge Request Review",
  description: "Submit a whole review on a merge request in one step: any number of inline comments anchored to lines of the diff, an overall summary comment, and optionally an approval. This is the tool for \"review this MR\" — call **Get Merge Request** and **Get Merge Request Diffs** first to read the changes, then send the findings back here. GitLab has no single submit-review API, so this action posts each inline comment as its own thread and then approves if asked; if an individual comment is rejected (usually a line that is not part of the diff) the rest are still posted and the failures are returned in `failed`, so check that array rather than assuming everything landed. Line numbers follow GitLab's diff rules: `new_line` for a line the merge request adds, `old_line` for a line it removes, both for an unchanged context line. There is no REST equivalent of GitLab's *Request changes* state — to block a merge request, leave the findings as comments and do not approve. [See the documentation](https://docs.gitlab.com/api/discussions/#create-new-merge-request-thread)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
    summary: {
      type: "string",
      label: "Summary",
      description: "An overall comment on the merge request, posted as a plain (non-inline) comment after the inline ones. This is where the verdict goes — what the change does well, what is blocking, what you checked. Optional, but a review with only inline nitpicks and no summary reads badly.",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Inline Comments",
      description: "JSON array of inline comments to anchor to the diff. Each entry is `{\"new_path\": \"...\", \"new_line\": N, \"body\": \"...\"}` — for example `[{\"new_path\": \"src/api/client.py\", \"new_line\": 88, \"body\": \"This retries forever if the host is down; cap it.\"}, {\"old_path\": \"src/legacy.py\", \"old_line\": 12, \"body\": \"Good riddance.\"}]`. Use `new_line` for an added line, `old_line` for a removed one, and both for an unchanged context line. Paths and line numbers must come from **Get Merge Request Diffs**.",
      optional: true,
    },
    action: {
      type: "string",
      label: "Action",
      description: "`comment` (the default) posts the feedback only. `approve` posts the feedback and then approves the merge request. GitLab refuses to let you approve your own merge request, so use `comment` on merge requests you authored.",
      options: [
        COMMENT,
        APPROVE,
      ],
      default: COMMENT,
      optional: true,
    },
  },
  methods: {
    parseComments(comments) {
      if (!comments) {
        return [];
      }
      let parsed = comments;
      if (typeof comments === "string") {
        try {
          parsed = JSON.parse(comments);
        } catch {
          throw new ConfigurationError("`Inline Comments` must be valid JSON, e.g. `[{\"new_path\": \"src/api.py\", \"new_line\": 88, \"body\": \"...\"}]`");
        }
      }
      if (!Array.isArray(parsed)) {
        throw new ConfigurationError("`Inline Comments` must be a JSON array, e.g. `[{\"new_path\": \"src/api.py\", \"new_line\": 88, \"body\": \"...\"}]`");
      }
      const missingBody = parsed.find((comment) => !comment?.body);
      if (missingBody) {
        throw new ConfigurationError("Every entry in `Inline Comments` needs a `body`.");
      }
      return parsed;
    },
  },
  async run({ $ }) {
    const comments = this.parseComments(this.comments);

    if (!comments.length && !this.summary && this.action !== APPROVE) {
      throw new ConfigurationError("Nothing to do — provide `Summary`, `Inline Comments`, or set `Action` to `approve`.");
    }

    const posted = [];
    const failed = [];
    let diffRefs;

    if (comments.length) {
      const mergeRequest = await this.gitlab.getMergeRequest(
        this.projectId,
        this.mergeRequestIid,
        {
          $,
        },
      );
      diffRefs = mergeRequest.diff_refs;

      for (const comment of comments) {
        // One bad line should not sink the rest of the review, so failures are
        // collected per comment and reported instead of thrown.
        try {
          const discussion = await this.gitlab.createMergeRequestDiscussion(
            this.projectId,
            this.mergeRequestIid,
            {
              $,
              data: {
                body: comment.body,
                position: buildPosition(comment, diffRefs),
              },
            },
          );
          posted.push({
            id: discussion.id,
            new_path: comment.new_path ?? comment.newPath ?? comment.path,
            old_path: comment.old_path ?? comment.oldPath,
            new_line: comment.new_line ?? comment.newLine ?? comment.line,
            old_line: comment.old_line ?? comment.oldLine,
          });
        } catch (error) {
          failed.push({
            comment,
            error: error.message,
          });
        }
      }
    }

    let summaryNote;
    if (this.summary) {
      summaryNote = await this.gitlab.createMergeRequestNote(
        this.projectId,
        this.mergeRequestIid,
        {
          $,
          data: {
            body: this.summary,
          },
        },
      );
    }

    let approval;
    if (this.action === APPROVE) {
      // Approving without a SHA would also approve whatever was pushed while the
      // review was being written; GitLab rejects a stale one with a 409 instead.
      if (!diffRefs) {
        const mergeRequest = await this.gitlab.getMergeRequest(
          this.projectId,
          this.mergeRequestIid,
          {
            $,
          },
        );
        diffRefs = mergeRequest.diff_refs;
      }

      try {
        approval = await this.gitlab.approveMergeRequest(
          this.projectId,
          this.mergeRequestIid,
          {
            $,
            data: {
              sha: diffRefs?.head_sha,
            },
          },
        );
      } catch (error) {
        // The comments are already posted; failing silently would let the caller
        // believe the merge request was approved when it was not.
        throw new Error(`Posted ${posted.length} inline comment(s)${this.summary
          ? " and the summary"
          : ""}, but approving merge request !${this.mergeRequestIid} failed: ${error.message}`);
      }
    }

    const parts = [
      comments.length && (failed.length
        ? `Posted ${posted.length} of ${comments.length} inline comments (${failed.length} failed)`
        : `Posted ${posted.length} inline comment${posted.length === 1
          ? ""
          : "s"}`),
      this.summary && "left a summary comment",
      approval && "approved",
    ].filter(Boolean);

    const sentence = parts.length > 1
      ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`
      : parts[0];

    $.export("$summary", `${sentence} on merge request !${this.mergeRequestIid} in ${this.projectId}`);

    return {
      posted,
      failed,
      summary_note: summaryNote,
      approved: Boolean(approval),
      approvals: approval && {
        approved: approval.approved,
        approvals_required: approval.approvals_required,
        approvals_left: approval.approvals_left,
      },
    };
  },
};
