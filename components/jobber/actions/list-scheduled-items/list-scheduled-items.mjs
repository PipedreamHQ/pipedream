import jobber from "../../jobber.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "jobber-list-scheduled-items",
  name: "List Scheduled Items",
  description: "Retrieve scheduled items (visits, tasks, and events) occurring within a date range in Jobber. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jobber,
    startAt: {
      type: "string",
      label: "Start At",
      description: "Start of the date range to search, in ISO 8601 format (e.g. `2026-06-01T00:00:00Z`). The range between Start At and End At must be less than 1.5 years.",
    },
    endAt: {
      type: "string",
      label: "End At",
      description: "End of the date range to search, in ISO 8601 format (e.g. `2026-06-30T00:00:00Z`). The range between Start At and End At must be less than 1.5 years.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of scheduled items to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    if (new Date(this.endAt) <= new Date(this.startAt)) {
      throw new ConfigurationError("End At must be after Start At.");
    }

    const query = `query ListScheduledItems($first: Int, $after: String, $filter: ScheduledItemsFilterAttributes!) {
      scheduledItems(first: $first, after: $after, filter: $filter) {
        nodes {
          ${constants.SCHEDULED_ITEM_FIELDS}
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }`;

    const args = {
      filter: {
        occursWithin: {
          startAt: this.startAt,
          endAt: this.endAt,
        },
      },
    };
    const scheduledItems = await this.jobber.getPaginatedResources({
      query,
      args,
      resourceKey: "scheduledItems",
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${scheduledItems.length} scheduled item${scheduledItems.length === 1
      ? ""
      : "s"}`);
    return scheduledItems;
  },
};
