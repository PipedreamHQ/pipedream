import apify from "../../apify.app.mjs";
import { ACTOR_JOB_STATUSES } from "@apify/consts";

// The USPTO Trademark Search Actor (magnova/uspto-trademark-search) on the
// Apify Store. The run is executed and billed through the connected user's
// own Apify account, at the Actor's pay-per-event price per record returned.
const USPTO_TRADEMARK_SEARCH_ACTOR_ID = "I8KvtBliDeyVghVzU";

export default {
  key: "apify-search-uspto-trademarks",
  name: "Search USPTO Trademarks",
  description: "Search U.S. federal trademarks in the official USPTO database by wordmark, owner, class, status, or filing date, using the USPTO Trademark Search Actor. [See the documentation](https://apify.com/magnova/uspto-trademark-search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    apify,
    wordmark: {
      type: "string",
      label: "Wordmark / Brand Text",
      description: "Brand text to search for, e.g. `OPENAI`. Searches the combined mark wording.",
      optional: true,
    },
    owner: {
      type: "string",
      label: "Owner Name",
      description: "Filter by trademark owner name, e.g. `Nike, Inc.`.",
      optional: true,
    },
    internationalClass: {
      type: "string",
      label: "International Class",
      description: "International trademark class, 1-3 digits, e.g. `009` for software/electronics, `025` for clothing.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Mark Status",
      description: "Live marks are active; dead marks are abandoned, cancelled or expired, e.g. `live`.",
      options: [
        {
          label: "Live only",
          value: "live",
        },
        {
          label: "Dead only",
          value: "dead",
        },
        {
          label: "Live and dead",
          value: "any",
        },
      ],
      default: "live",
      optional: true,
    },
    filedAfter: {
      type: "string",
      label: "Filed After",
      description: "Only marks filed on or after this date. Format `YYYY-MM-DD`, e.g. `2026-01-01`. Useful for monitoring newly filed marks.",
      optional: true,
    },
    filedBefore: {
      type: "string",
      label: "Filed Before",
      description: "Only marks filed on or before this date. Format `YYYY-MM-DD`, e.g. `2026-12-31`.",
      optional: true,
    },
    serialNumber: {
      type: "string",
      label: "Serial Number",
      description: "Look up one specific mark by its 8-digit serial number, e.g. `97054561`. Use **Search USPTO Trademarks** to find a serial number (the `serialNumber` field of each returned trademark record).",
      optional: true,
    },
    query: {
      type: "string",
      label: "Advanced Query",
      description: "Advanced: raw field-tag query passed straight to the USPTO backend, e.g. `CM:\"APPLE\" AND IC:009 AND LD:true`. Tags: CM (mark text), ON (owner), IC (class), LD (live/dead), FD (filing date), SN (serial), RN (registration). Overrides the other filters.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of trademark records to return, e.g. `10`. The Actor charges per record returned, at its Apify Store pay-per-event price.",
      min: 1,
      max: 5000,
      default: 10,
      optional: true,
    },
    maxTotalChargeUsd: {
      propDefinition: [
        apify,
        "maxTotalChargeUsd",
      ],
    },
  },
  async run({ $ }) {
    const input = {};
    for (const key of [
      "wordmark",
      "owner",
      "internationalClass",
      "status",
      "filedAfter",
      "filedBefore",
      "serialNumber",
      "query",
      "maxResults",
    ]) {
      if (this[key] !== undefined && this[key] !== "") {
        input[key] = this[key];
      }
    }

    const {
      status,
      defaultDatasetId,
      consoleUrl,
    } = await this.apify.runActor({
      actorId: USPTO_TRADEMARK_SEARCH_ACTOR_ID,
      input,
      options: {
        ...(this.maxTotalChargeUsd && {
          maxTotalChargeUsd: Number(this.maxTotalChargeUsd),
        }),
      },
    });

    if (status !== ACTOR_JOB_STATUSES.SUCCEEDED) {
      throw new Error(`Run has finished with status: ${status}. Inspect it here: ${consoleUrl}.`);
    }

    const { items } = await this.apify.listDatasetItems({
      datasetId: defaultDatasetId,
      params: {
        limit: this.maxResults,
      },
    });

    $.export("$summary", `Successfully retrieved ${items.length} trademark record${items.length === 1
      ? ""
      : "s"}.`);
    return items;
  },
};
