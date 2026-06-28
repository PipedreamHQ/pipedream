import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-document-from-template",
  name: "Create Document From Template",
  description: "Create a new Google Doc by copying a template document and substituting `{{placeholder}}` tokens with values. Use **Find Document** to resolve the template's name to its ID. Returns `{documentId, title, url}`. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDocs,
    templateId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
      label: "Template ID",
      description: "The ID of the template document to copy. The template should contain placeholders like `{{name}}`. Use **Find Document** to resolve a template's name to its ID.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new document.",
    },
    variables: {
      type: "string",
      label: "Variables",
      description: "JSON object mapping placeholder tokens to their replacement values. Tokens are matched as `{{key}}` in the template. Example: `{\"species\": \"Velociraptor\", \"location\": \"Paddock 11\"}`.",
      optional: true,
    },
    folderId: {
      propDefinition: [
        googleDocs,
        "folderId",
      ],
    },
  },
  async run({ $ }) {
    const copy = await this.googleDocs.copyFile(this.templateId, {
      requestBody: {
        name: this.title,
        parents: this.folderId
          ? [
            this.folderId,
          ]
          : undefined,
      },
    });
    const documentId = copy.id;

    const variables = typeof this.variables === "string"
      ? JSON.parse(this.variables)
      : (this.variables || {});

    const requests = Object.entries(variables).map(([
      key,
      value,
    ]) => ({
      replaceAllText: {
        containsText: {
          text: `{{${key}}}`,
          matchCase: true,
        },
        replaceText: String(value),
      },
    }));

    if (requests.length) {
      await this.googleDocs.docs().documents.batchUpdate({
        documentId,
        requestBody: {
          requests,
        },
      });
    }

    const url = `https://docs.google.com/document/d/${documentId}/edit`;
    $.export("$summary", `Created document "${this.title}" from template (${documentId})`);
    return {
      documentId,
      title: this.title,
      url,
    };
  },
};
