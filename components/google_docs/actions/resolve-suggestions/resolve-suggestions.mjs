import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import { SUGGESTION_DECISIONS } from "../../common/constants.mjs";

export default {
  key: "google_docs-resolve-suggestions",
  name: "Resolve Suggestions",
  description: "Accept or reject suggestions (tracked changes made in Suggesting mode) in a Google Doc. Accepting applies a suggestion to the document; rejecting discards it. Get suggestion IDs from **List Suggestions**, or from the `suggestionIds` a write action returns when **Suggest Changes** is on. Use **Find Document** to resolve a document's name to its ID. Returns `{documentId, decision, resolvedSuggestionIds}`. Rejecting uses [RejectSuggestionRequest](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#RejectSuggestionRequest). [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#AcceptSuggestionRequest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    suggestionIds: {
      type: "string[]",
      label: "Suggestion IDs",
      description: "The suggestions to resolve, e.g. `[\"suggest.l9bthay87lnf\", \"suggest.8bycbfqkkem4\"]`. Get them from **List Suggestions**. All are resolved together: if any ID does not exist, none are resolved.",
    },
    decision: {
      type: "string",
      label: "Decision",
      description: "`accept` applies the suggestions to the document; `reject` discards them. Both need edit access to the document, except that a suggestion's author can always reject it.",
      options: SUGGESTION_DECISIONS,
    },
  },
  async run({ $ }) {
    const {
      googleDocs,
      documentId,
      decision,
    } = this;

    let ids = this.suggestionIds;
    if (typeof ids === "string") {
      try {
        ids = JSON.parse(ids);
      } catch {
        ids = ids.split(",");
      }
    }
    const suggestionIds = [
      ...new Set([
        ids,
      ].flat()
        .flatMap((id) => String(id ?? "").split(","))
        .map((id) => id.trim())
        .filter(Boolean)),
    ];
    if (!suggestionIds.length) {
      throw new ConfigurationError("Provide at least one Suggestion ID. Call **List Suggestions** to get the document's open suggestion IDs.");
    }

    const response = await googleDocs.resolveSuggestions(documentId, suggestionIds, decision);
    const resolvedSuggestionIds = (response?.data?.suggestionResponses ?? [])
      .flatMap(({
        acceptedSuggestionIds = [], rejectedSuggestionIds = [],
      }) => [
        ...acceptedSuggestionIds,
        ...rejectedSuggestionIds,
      ]);

    $.export("$summary", `${decision === "accept"
      ? "Accepted"
      : "Rejected"} ${resolvedSuggestionIds.length} suggestion${resolvedSuggestionIds.length === 1
      ? ""
      : "s"} in document ${documentId}`);
    return {
      documentId,
      decision,
      resolvedSuggestionIds,
    };
  },
};
