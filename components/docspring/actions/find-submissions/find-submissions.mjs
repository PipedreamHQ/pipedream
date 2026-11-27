import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-find-submissions",
  name: "Find Submissions",
  description: "Find submissions, newest first, optionally for one template, live or test only, or created in a time range."
    + " Returns a list of submissions; each one's PDF links are in `files.pdf`."
    + " Use **Get Submission** when you have the submission's ID."
    + " [See the documentation](https://docspring.com/docs/api/#tag/submissions/get/submissions)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docspring,
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
      description: "Only find this template's submissions, e.g. `tpl_1234567890abcdef01`. Use **Find Templates** to find it (the `id` field)."
        + " Leave blank for every template.",
      optional: true,
    },
    mode: {
      type: "string",
      label: "Live or Test",
      description: "Which submissions to find: `any` (the default), `live` or `test`. e.g. `live`.",
      options: [
        {
          label: "Live and test",
          value: "any",
        },
        {
          label: "Live only",
          value: "live",
        },
        {
          label: "Test only",
          value: "test",
        },
      ],
      default: "any",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only find submissions created after this time, as an ISO 8601 date-time with a time zone, e.g. `2026-01-31T09:00:00Z`.",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Only find submissions created before this time, as an ISO 8601 date-time with a time zone, e.g. `2026-02-01T00:00:00Z`.",
      optional: true,
    },
    includeData: {
      propDefinition: [
        docspring,
        "includeData",
      ],
    },
    maxResults: {
      propDefinition: [
        docspring,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const params = utils.compact({
      test: utils.testFilter(this.mode),
      created_after: this.createdAfter,
      created_before: this.createdBefore,
      include_data: utils.toBoolean(this.includeData, "Include Data") || undefined,
    });
    const pages = this.docspring.paginate({
      fn: this.templateId
        ? this.docspring.listTemplateSubmissions
        : this.docspring.listSubmissions,
      args: utils.compact({
        $,
        templateId: this.templateId,
        params,
      }),
      max: utils.maxResults(this.maxResults),
    });
    const submissions = [];
    for await (const submission of pages) {
      submissions.push(submission);
    }
    $.export("$summary", `Found ${submissions.length} submission(s)`);
    return submissions;
  },
};
