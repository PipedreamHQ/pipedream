import fragments from "./fragments.mjs";

export default {
  getIssue: `
    query GetIssue($issueId: String!) {
      issue(id: $issueId) {
        ...Issue
      }
    }
    ${fragments.issue}
  `,
  listIssues: `
    query ListIssues(
      $filter: IssueFilter,
      $before: String,
      $after: String,
      $first: Int,
      $last: Int,
      $includeArchived: Boolean,
      $orderBy: PaginationOrderBy
    ) {
      issues(
        filter: $filter,
        before: $before,
        after: $after,
        first: $first,
        last: $last,
        includeArchived: $includeArchived,
        orderBy: $orderBy
      ) {
        pageInfo {
          ...PageInfo
        }
        nodes {
          ...Issue
        }
      }
    }
    ${fragments.issue}
    ${fragments.pageInfo}
  `,
  getComment: `
    query GetComment($commentId: String!) {
      comment(id: $commentId) {
        ...Comment
      }
    }
    ${fragments.comment}
  `,
  listProjects: `
    query ListProjects {
      projects {
        nodes {
          id
          name
        }
      }
    }
  `,
};
