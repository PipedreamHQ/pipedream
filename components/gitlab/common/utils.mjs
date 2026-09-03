import { ConfigurationError } from "@pipedream/platform";
import constants from "./constants.mjs";

/**
 * GitLab accepts either a numeric project ID or a URL-encoded path for `:id`.
 * The unencoded path 404s, so paths must always be encoded exactly once.
 */
export function projectPath(projectId) {
  if (projectId === undefined || projectId === null || `${projectId}`.trim() === "") {
    throw new ConfigurationError("Project is required. Pass a project path (e.g. `group/project`) or a numeric project ID.");
  }

  let value = String(projectId).trim();

  // Users paste full GitLab URLs at agents; keep only the namespaced project.
  const withSuffix = value.match(/^https?:\/\/[^/]+\/(.+?)\/-\//);
  const bareUrl = value.match(/^https?:\/\/[^/]+\/(.+)$/);
  if (withSuffix) {
    value = withSuffix[1];
  } else if (bareUrl) {
    value = bareUrl[1];
  }

  value = value.replace(/^\/+|\/+$/g, "");

  if (/^\d+$/.test(value)) {
    return value;
  }

  return /%2f/i.test(value)
    ? value
    : encodeURIComponent(value);
}

/**
 * Pull the MR IID out of a merge request URL, so a pasted link works wherever an
 * IID is expected. Returns undefined when the input is not a URL.
 */
export function mergeRequestIidFromUrl(value) {
  const match = String(value ?? "").match(/\/-\/merge_requests\/(\d+)/);
  return match
    ? Number(match[1])
    : undefined;
}

/**
 * Walk GitLab's `page`/`per_page` pagination up to `maxResults`.
 * `truncated` tells the caller whether more results were left behind, so the
 * action's summary can say so instead of silently under-reporting.
 */
export async function paginate({
  requestFn,
  params = {},
  maxResults = constants.DEFAULT_MAX_RESULTS,
}) {
  const items = [];
  let page = 1;
  let truncated = false;

  while (items.length < maxResults) {
    const perPage = Math.min(constants.MAX_PER_PAGE, maxResults - items.length);
    const response = await requestFn({
      ...params,
      per_page: perPage,
      page,
    });

    if (!Array.isArray(response) || !response.length) {
      break;
    }

    items.push(...response);

    // A short page means the end of the collection; a full one means there may
    // be more, which only matters once we have hit the cap.
    if (response.length < perPage) {
      break;
    }
    if (items.length >= maxResults) {
      truncated = true;
      break;
    }
    page += 1;
  }

  return {
    items: items.slice(0, maxResults),
    truncated,
  };
}

const usernames = (users = []) => users
  .map((user) => user?.username)
  .filter(Boolean);

/**
 * Projected MR row. Field names deliberately match GitLab's own, so anything an
 * agent reads in the API docs lines up with what it gets back.
 */
export function summarizeMergeRequest(mergeRequest) {
  return {
    iid: mergeRequest.iid,
    project_id: mergeRequest.project_id,
    title: mergeRequest.title,
    state: mergeRequest.state,
    draft: mergeRequest.draft ?? mergeRequest.work_in_progress,
    author: mergeRequest.author?.username,
    assignees: usernames(mergeRequest.assignees),
    reviewers: usernames(mergeRequest.reviewers),
    source_branch: mergeRequest.source_branch,
    target_branch: mergeRequest.target_branch,
    labels: mergeRequest.labels,
    milestone: mergeRequest.milestone?.title,
    detailed_merge_status: mergeRequest.detailed_merge_status,
    has_conflicts: mergeRequest.has_conflicts,
    user_notes_count: mergeRequest.user_notes_count,
    created_at: mergeRequest.created_at,
    updated_at: mergeRequest.updated_at,
    merged_at: mergeRequest.merged_at,
    web_url: mergeRequest.web_url,
  };
}

/**
 * Projected changed file. `too_large` and `collapsed` are kept because GitLab
 * omits or truncates `diff` for those files — without the flags a reader would
 * take an empty diff for an unchanged file.
 */
export function summarizeDiff(file) {
  return {
    new_path: file.new_path,
    old_path: file.old_path,
    new_file: file.new_file,
    deleted_file: file.deleted_file,
    renamed_file: file.renamed_file,
    generated_file: file.generated_file,
    too_large: file.too_large,
    collapsed: file.collapsed,
    diff: file.diff,
  };
}

/**
 * Projected commit. Both SHAs are kept on purpose: `short_id` is what a person
 * reads, `id` is what the API needs back.
 */
export function summarizeCommit(commit) {
  return {
    id: commit.id,
    short_id: commit.short_id,
    title: commit.title,
    author_name: commit.author_name,
    authored_date: commit.authored_date,
    web_url: commit.web_url,
  };
}

/**
 * Projected note. `position` is narrowed to the path and line rather than passed
 * through, since that is the anchor needed to reply to or resolve the thread;
 * GitLab's SHA triple is dropped because callers re-read it from `diff_refs`.
 * `system` is kept so bookkeeping notes can be filtered out by the caller.
 */
export function summarizeNote(note) {
  return {
    id: note.id,
    author: note.author?.username,
    body: note.body,
    created_at: note.created_at,
    updated_at: note.updated_at,
    resolvable: note.resolvable,
    resolved: note.resolved,
    resolved_by: note.resolved_by?.username,
    system: note.system,
    position: note.position && {
      new_path: note.position.new_path,
      old_path: note.position.old_path,
      new_line: note.position.new_line,
      old_line: note.position.old_line,
    },
  };
}

/**
 * Projected thread. `resolved` is left `undefined` — not `false` — for a thread
 * where nothing is resolvable, because a plain comment has no resolved state and
 * reporting `false` would imply it could be closed.
 */
export function summarizeDiscussion(discussion) {
  const notes = (discussion.notes ?? []).map(summarizeNote);
  return {
    id: discussion.id,
    individual_note: discussion.individual_note,
    resolved: notes.some((note) => note.resolvable)
      ? notes.every((note) => !note.resolvable || note.resolved)
      : undefined,
    notes,
  };
}

/**
 * Flattens the "can this merge?" signals that are otherwise spread across the MR
 * object, the approvals endpoint and the pipeline list.
 */
export function mergeRequestReadiness(mergeRequest, approvals, pipelines) {
  const pipeline = mergeRequest.head_pipeline ?? pipelines?.[0];
  const approvedBy = (approvals?.approved_by ?? [])
    .map((entry) => entry?.user?.username ?? entry?.username)
    .filter(Boolean);

  return {
    state: mergeRequest.state,
    draft: mergeRequest.draft ?? mergeRequest.work_in_progress,
    detailed_merge_status: mergeRequest.detailed_merge_status,
    has_conflicts: mergeRequest.has_conflicts,
    blocking_discussions_resolved: mergeRequest.blocking_discussions_resolved,
    pipeline_status: pipeline?.status,
    pipeline_url: pipeline?.web_url,
    approved: approvals?.approved,
    approvals_required: approvals?.approvals_required,
    approvals_left: approvals?.approvals_left,
    approved_by: approvedBy,
    user_can_approve: approvals?.user_can_approve,
    user_has_approved: approvals?.user_has_approved,
  };
}

/**
 * Build the `position` object an inline merge request thread needs.
 *
 * The SHAs come from the merge request's own `diff_refs`, never from the caller.
 * GitLab's line rules: an added line takes `new_line` only, a removed line takes
 * `old_line` only, and an unchanged context line takes both — so only the line
 * numbers actually supplied are forwarded.
 */
export function buildPosition(comment, diffRefs) {
  const newPath = comment.new_path ?? comment.newPath ?? comment.path;
  const oldPath = comment.old_path ?? comment.oldPath;
  const newLine = comment.new_line ?? comment.newLine ?? comment.line;
  const oldLine = comment.old_line ?? comment.oldLine;

  if (!newPath && !oldPath) {
    throw new ConfigurationError("Each inline comment needs `new_path` — the file's path after the change, as returned by Get Merge Request Diffs.");
  }
  if (newLine === undefined && oldLine === undefined) {
    throw new ConfigurationError(`The inline comment on \`${newPath ?? oldPath}\` needs \`new_line\` (an added or unchanged line) or \`old_line\` (a removed line).`);
  }
  if (!diffRefs?.head_sha) {
    throw new ConfigurationError("This merge request has no `diff_refs`, so inline comments cannot be anchored to the diff. Post a plain comment instead by omitting the file and line.");
  }

  return {
    base_sha: diffRefs.base_sha,
    start_sha: diffRefs.start_sha,
    head_sha: diffRefs.head_sha,
    position_type: "text",
    new_path: newPath ?? oldPath,
    old_path: oldPath ?? newPath,
    ...newLine !== undefined && {
      new_line: newLine,
    },
    ...oldLine !== undefined && {
      old_line: oldLine,
    },
  };
}

/**
 * The three merge request list endpoints differ only in scope, and both the list
 * and search actions pick between them the same way. Returns the request
 * function plus the phrase the caller puts in its `$summary`.
 */
export function selectMergeRequestScope(app, {
  projectId, groupId, $,
}) {
  if (projectId && groupId) {
    throw new ConfigurationError("Set Project or Group, not both — they select different scopes and only one would apply.");
  }

  if (projectId) {
    return {
      requestFn: (params) => app.listProjectMergeRequests(projectId, {
        $,
        params,
      }),
      where: ` in ${projectId}`,
    };
  }

  if (groupId) {
    return {
      requestFn: (params) => app.listGroupMergeRequests(groupId, {
        $,
        params,
      }),
      where: ` in group ${groupId}`,
    };
  }

  return {
    requestFn: (params) => app.listMergeRequests({
      $,
      params,
    }),
    where: "",
  };
}
