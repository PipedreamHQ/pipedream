import { ConfigurationError } from "@pipedream/platform";
import grain from "../../grain.app.mjs";

export default {
  key: "grain-list-recordings",
  name: "List Recordings",
  description: "Lists Grain recordings, optionally filtered by start datetime range (ISO8601), title search, participant scope, team, or meeting type."
    + " Automatically paginates and returns up to Max Results recordings."
    + " Use this to find recording IDs for **Get Recording** and **Get Transcript**."
    + " Example: `titleSearch: \"Acme\"` returns recordings like"
    + " `[{\"id\": \"pppp6666-qq77-rr88-ss99-tttt00000000\", \"title\": \"Acme Renewal Call\", \"start_datetime\": \"2026-01-05T15:00:00Z\", \"media_type\": \"video\", ...}]`."
    + " Pass `fields` to return only the fields you need instead of the full object."
    + " [See the documentation](https://developers.grain.com/#list-recordings)",
  version: "0.1.0",
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
      description: "Only return recordings that started before this ISO8601 datetime. E.g. `2025-01-01T00:00:00Z`."
        + " Verified against the live API to filter at day granularity — a cutoff earlier or later than a recording's calendar day works reliably, but a same-day cutoff may not exclude recordings from later that same day.",
      optional: true,
    },
    afterDatetime: {
      type: "string",
      label: "After Datetime",
      description: "Only return recordings that started after this ISO8601 datetime. E.g. `2025-01-01T00:00:00Z`."
        + " Verified against the live API to filter at day granularity — a cutoff earlier or later than a recording's calendar day works reliably, but a same-day cutoff may not exclude recordings from earlier that same day.",
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
    team: {
      type: "string",
      label: "Team ID",
      description: "Only return recordings belonging to this team. Use **List Teams** to find team IDs. E.g. `a414c333-c9fe-4fdc-9131-fb31796699b2`.",
      optional: true,
    },
    meetingType: {
      type: "string",
      label: "Meeting Type ID",
      description: "Only return recordings with this meeting type. Use **List Meeting Types** to find meeting type IDs. E.g. `a97a9e83-c45e-4a46-9b1e-216ce1e69252`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of recordings to return. Must be a positive integer.",
      optional: true,
      default: 100,
      min: 1,
      max: 500,
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
    let fields = this.fields;
    if (typeof fields === "string") {
      try {
        fields = JSON.parse(fields);
      } catch {
        throw new ConfigurationError("`fields` must be a JSON array of field names.");
      }
    }
    if (
      fields !== undefined
      && (
        !Array.isArray(fields)
        || fields.some((field) => typeof field !== "string" || !field)
      )
    ) {
      throw new ConfigurationError("`fields` must be an array of non-empty field names.");
    }

    const filter = {
      before_datetime: this.beforeDatetime,
      after_datetime: this.afterDatetime,
      title_search: this.titleSearch,
      participant_scope: this.participantScope,
      team: this.team,
      meeting_type: this.meetingType,
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

    if (!fields?.length) {
      return recordings;
    }
    return recordings.map((recording) => Object.fromEntries(
      fields.map((field) => [
        field,
        recording[field],
      ]),
    ));
  },
};
