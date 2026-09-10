import grain from "../../grain.app.mjs";

export default {
  key: "grain-list-recordings",
  name: "List Recordings",
  description: "Lists Grain recordings, optionally filtered by start datetime range (ISO8601), title search, or participant scope."
    + " Automatically paginates and returns up to Max Results recordings."
    + " Use this to find recording IDs for **Get Recording** and **Get Transcript**."
    + " Example: `titleSearch: \"Acme\"` returns recordings like"
    + " `[{\"id\": \"pppp6666-qq77-rr88-ss99-tttt00000000\", \"title\": \"Acme Renewal Call\", \"start_datetime\": \"2026-01-05T15:00:00Z\", \"media_type\": \"video\", ...}]`."
    + " Pass `fields` to return only the fields you need instead of the full object."
    + " [See the documentation](https://developers.grain.com/#list-recordings)",
  version: "0.0.2",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    grain,
    beforeDatetime: {
      type: "string",
      label: "Before Datetime",
      description: "Only return recordings that started before this ISO8601 datetime. E.g. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    afterDatetime: {
      type: "string",
      label: "After Datetime",
      description: "Only return recordings that started after this ISO8601 datetime. E.g. `2025-01-01T00:00:00Z`",
      optional: true,
    },
    titleSearch: {
      type: "string",
      label: "Title Search",
      description: "Only return recordings whose title matches this search string",
      optional: true,
    },
    participantScope: {
      type: "string",
      label: "Participant Scope",
      description: "Only return recordings whose participants are all internal, or that include external participants",
      options: [
        "internal",
        "external",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of recordings to return. Must be a positive integer.",
      optional: true,
      default: 100,
      min: 1,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Only include these fields in each returned recording (e.g. `[\"id\", \"title\", \"start_datetime\"]`)."
        + " Omit fields to return the full recording object for each result.",
      optional: true,
    },
  },
  async run({ $ }) {
    const filter = {
      before_datetime: this.beforeDatetime,
      after_datetime: this.afterDatetime,
      title_search: this.titleSearch,
      participant_scope: this.participantScope,
    };

    const recordings = [];
    let cursor;
    do {
      const {
        recordings: page, cursor: nextCursor,
      } = await this.grain.listRecordings({
        $,
        data: {
          cursor,
          filter,
        },
      });
      recordings.push(...page);
      cursor = nextCursor;
    } while (cursor && recordings.length < this.maxResults);

    if (recordings.length > this.maxResults) {
      recordings.length = this.maxResults;
    }

    $.export("$summary", `Successfully fetched ${recordings.length} recording${recordings.length === 1
      ? ""
      : "s"}`);

    if (!this.fields?.length) {
      return recordings;
    }
    return recordings.map((recording) => Object.fromEntries(
      this.fields.map((field) => [
        field,
        recording[field],
      ]),
    ));
  },
};
