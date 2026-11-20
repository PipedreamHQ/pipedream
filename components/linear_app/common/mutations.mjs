import fragments from "./fragments.mjs";

export default {
  createIssue: `
    mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          ...IssueMutationResult
        }
      }
    }
    ${fragments.issueMutationResult}
  `,
  updateIssue: `
    mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) {
        success
        issue {
          ...IssueMutationResult
        }
      }
    }
    ${fragments.issueMutationResult}
  `,
  removeLabelFromIssue: `
    mutation IssueRemoveLabel($id: String!, $labelId: String!) {
      issueRemoveLabel(id: $id, labelId: $labelId) {
        success
        issue {
          ...IssueMutationResult
        }
      }
    }
    ${fragments.issueMutationResult}
  `,
  createComment: `
    mutation CommentCreate($input: CommentCreateInput!) {
      commentCreate(input: $input) {
        success
        comment {
          ...CommentMutationResult
        }
      }
    }
    ${fragments.commentMutationResult}
  `,
  createDocument: `
    mutation DocumentCreate($input: DocumentCreateInput!) {
      documentCreate(input: $input) {
        success
        document {
          ...DocumentMutationResult
        }
      }
    }
    ${fragments.documentMutationResult}
  `,
  updateDocument: `
    mutation DocumentUpdate($id: String!, $input: DocumentUpdateInput!) {
      documentUpdate(id: $id, input: $input) {
        success
        document {
          ...DocumentMutationResult
        }
      }
    }
    ${fragments.documentMutationResult}
  `,
};
