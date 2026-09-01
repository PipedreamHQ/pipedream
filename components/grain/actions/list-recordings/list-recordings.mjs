import grain from "../../grain.app.mjs";

export default {
  key: "grain-list-recordings",
  name: "List Recordings",
  description: "Lists recordings, optionally filtered by date range, title, or participant scope. [See the documentation](https://developers.grain.com)",
  version: "0.0.1",
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
      description: "Maximum number of recordings to return",
      optional: true,
      default: 100,
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
          filter: Object.fromEntries(Object.entries(filter).filter(([
            , value,
          ]) => value !== undefined)),
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
    return recordings;
  },
};
