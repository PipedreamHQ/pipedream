import fragments from "./fragments.mjs";

export default {
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
