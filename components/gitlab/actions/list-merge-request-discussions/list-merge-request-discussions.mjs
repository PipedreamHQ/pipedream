import gitlab from "../../gitlab.app.mjs";
import {
  paginate,
  summarizeDiscussion,
} from "../../common/utils.mjs";

export default {
  key: "gitlab-list-merge-request-discussions",
  name: "List Merge Request Discussions",
  description: "List the comment threads on a merge request — both general comments and inline threads anchored to lines of the diff. Use this to read existing review feedback before adding your own, to find what a reviewer objected to, or to get the `id` of a thread so you can reply to it with **Create Merge Request Comment** or close it with **Resolve Merge Request Thread**. Each thread's notes carry `resolvable`, `resolved` and, for inline threads, the `position` (file path and line) they are attached to. GitLab records label changes, assignments and other bookkeeping as system notes; those are filtered out by default because they are rarely what a reader wants — set **Include System Notes** to `true` to see them. Set **Only Unresolved** to `true` to get just the threads still needing attention. [See the documentation](https://docs.gitlab.com/api/discussions/#list-project-merge-request-discussion-items)",
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
    onlyUnresolved: {
      type: "boolean",
      label: "Only Unresolved",
      description: "Return only threads that are resolvable and not yet resolved — the open review feedback. Defaults to `false`. Threads that cannot be resolved at all (plain comments) are excluded when this is `true`.",
      default: false,
      optional: true,
    },
    includeSystemNotes: {
      type: "boolean",
      label: "Include System Notes",
      description: "Whether to include GitLab's own bookkeeping notes — label changes, assignee changes, \"marked as draft\", and similar. Defaults to `false`, which keeps only what people actually wrote.",
      default: false,
      optional: true,
    },
    maxResults: {
      propDefinition: [
        gitlab,
        "maxResults",
      ],
      description: "Maximum number of threads to return in total, paginating as needed. Defaults to `100`. Note this counts threads before the system-note and unresolved filters are applied.",
    },
  },
  async run({ $ }) {
    const {
      items, truncated,
    } = await paginate({
      requestFn: (params) => this.gitlab.listMergeRequestDiscussions(
        this.projectId,
        this.mergeRequestIid,
        {
          $,
          params,
        },
      ),
      maxResults: this.maxResults,
    });

    let discussions = items.map(summarizeDiscussion);

    if (!this.includeSystemNotes) {
      discussions = discussions
        .map((discussion) => ({
          ...discussion,
          notes: discussion.notes.filter((note) => !note.system),
        }))
        .filter((discussion) => discussion.notes.length);
    }

    if (this.onlyUnresolved) {
      discussions = discussions.filter((discussion) =>
        discussion.notes.some((note) => note.resolvable && !note.resolved));
    }

    const filter = this.onlyUnresolved
      ? "unresolved "
      : "";
    const suffix = truncated
      ? " — capped at Max Results, there may be more"
      : "";
    $.export("$summary", `Retrieved ${discussions.length} ${filter}thread${discussions.length === 1
      ? ""
      : "s"} on merge request !${this.mergeRequestIid} in ${this.projectId}${suffix}`);

    return discussions;
  },
};
