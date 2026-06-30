import app from "../../lever.app.mjs";

export default {
  key: "lever-list-opportunity-items",
  name: "List Opportunity Items",
  description:
    "Returns sub-records attached to a single opportunity (candidate): notes, feedback, interviews, resumes, files, or offers."
    + " Use this when asked about a candidate's notes, interview feedback/scorecards, scheduled interviews, resumes, attached files, or offer."
    + " Set `resource` to choose which: `notes` (recruiter notes), `feedback` (interview scorecards — each with panel id, interviewer, and score), `interviews` (scheduled interviews — each with panel id, date, interviewers), `resumes` (parsed resumes — each with a resume id), `files` (other attached documents — each with file id, name, extension), or `offers` (offer details)."
    + " Use **Search Opportunities** to find the opportunity ID first."
    + " The panel IDs returned by `interviews`/`feedback` are used by **Submit Feedback**; the `resumes` resource returns each resume's parsed data inline (status, file info, and extracted fields)."
    + " For `notes`, `feedback`, `interviews`, and `offers` this returns one page (up to `limit`); if the response's `hasNext` is true, pass its `next` value to `offset` to fetch the following page."
    + " Gotcha: `resumes` and `files` are **not** paginated — Lever returns the full set in a single payload with no `hasNext`/`next` cursor, and `limit`/`offset` are ignored, so do not expect cursor metadata for them."
    + " Example: to read a candidate's interview feedback, call with opportunityId=\"<id>\", resource=\"feedback\" → returns feedback records each with panel id, interviewer, score, and completed form fields."
    + " [See the documentation](https://hire.lever.co/developer/documentation#opportunities)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
      description: "The ID of the opportunity whose items to retrieve. Use **Search Opportunities** to find opportunity IDs.",
    },
    resource: {
      type: "string",
      label: "Resource",
      description: "Which sub-records to return for the opportunity.",
      options: [
        "notes",
        "feedback",
        "interviews",
        "resumes",
        "files",
        "offers",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Maximum number of items to return (1–100). Defaults to 100. Ignored for `resumes`/`files`, which Lever does not paginate.",
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  methods: {
    // Lever rejects pagination params on these sub-resources with
    // "pagination is not supported for this endpoint"; the rest accept them.
    paginates(resource) {
      return ![
        "resumes",
        "files",
      ].includes(resource);
    },
  },
  async run({ $ }) {
    const params = this.paginates(this.resource)
      ? {
        limit: this.limit,
        offset: this.offset,
      }
      : {};

    const response = await this.app.listOpportunityItems(this.opportunityId, this.resource, {
      $,
      params,
    });
    const items = response.data ?? response;
    $.export("$summary", `Retrieved ${items.length} ${this.resource} item${items.length === 1
      ? ""
      : "s"} for opportunity ${this.opportunityId}`);
    return response;
  },
};
