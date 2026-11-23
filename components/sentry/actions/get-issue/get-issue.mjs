import app from "../../sentry.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sentry-get-issue",
  name: "Get Issue",
  description: "Retrieve one Sentry issue by its numeric id or short id (e.g. `JURASSIC-PARK-API-1`), including its activity history (first seen, assignments, comments), who has seen it, participants and first/last release."
    + " Use when the user has an issue id and wants its details."
    + " To browse or find issues in a project, use **List Project Issues** instead; to change an issue, use **Update Issue**; to list the individual occurrences, use **List Issue Events**."
    + " Returns only the selected fields (always includes `id`); by default: id, shortId, title, culprit, level, status, substatus, count, userCount, firstSeen, lastSeen, permalink, project, assignedTo, metadata, activity, seenBy, participants, firstRelease, lastRelease."
    + " Example: organizationIdOrSlug=\"acme-corp\", issueId=\"4512345678\" → the issue's title, status, event count and activity list."
    + " [See the documentation](https://docs.sentry.io/api/events/retrieve-an-issue/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    organizationIdOrSlug: {
      propDefinition: [
        app,
        "organizationIdOrSlug",
      ],
    },
    issueId: {
      propDefinition: [
        app,
        "issueIdentifier",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fieldsSelection",
      ],
      description: "Top-level issue fields to return, e.g. `[\"id\",\"title\",\"status\",\"count\"]`. `id` is always included. Omit to get the default set listed in the action description.",
    },
  },
  async run({ $ }) {
    const defaultFields = [
      "shortId",
      "title",
      "culprit",
      "level",
      "status",
      "substatus",
      "count",
      "userCount",
      "firstSeen",
      "lastSeen",
      "permalink",
      "project",
      "assignedTo",
      "metadata",
      "activity",
      "seenBy",
      "participants",
      "firstRelease",
      "lastRelease",
    ];
    const issue = await this.app.getIssue(this.organizationIdOrSlug, this.issueId);
    const names = this.fields?.length
      ? this.fields
      : defaultFields;
    $.export("$summary", `Retrieved issue ${issue.shortId ?? issue.id}`);
    return utils.pickFields(issue, names);
  },
};
