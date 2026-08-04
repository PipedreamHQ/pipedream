import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-document-from-template",
  name: "Create Document From Template",
  description: "Create a new Google Doc by copying a template document and substituting `{{placeholder}}` tokens with values. Use **Find Document** to resolve the template's name to its ID. Returns `{documentId, title, url}`. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
  version: "1.0.1",
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
        "documentFolderId",
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

    let variables = this.variables ?? {};
    if (typeof variables === "string") {
      try {
        variables = JSON.parse(variables);
      } catch {
        throw new ConfigurationError("`variables` must be a valid JSON object, e.g. `{\"species\": \"Velociraptor\"}`.");
      }
    }
    if (typeof variables !== "object" || variables === null || Array.isArray(variables)) {
      throw new ConfigurationError("`variables` must be a JSON object mapping placeholder tokens to values, e.g. `{\"species\": \"Velociraptor\"}`.");
    }

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
      await this.googleDocs.batchUpdate(documentId, requests);
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
