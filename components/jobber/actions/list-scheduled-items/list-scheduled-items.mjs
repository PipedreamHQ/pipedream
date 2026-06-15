import jobber from "../../jobber.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "jobber-list-scheduled-items",
  name: "List Scheduled Items",
  description: "Retrieve scheduled items (visits, tasks, and events) from Jobber. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jobber,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of scheduled items to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const query = `query ListScheduledItems($first: Int, $after: String) {
      scheduledItems(first: $first, after: $after) {
        nodes {
          ${constants.SCHEDULED_ITEM_FIELDS}
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }`;

    const scheduledItems = await this.jobber.getPaginatedResources({
      query,
      resourceKey: "scheduledItems",
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${scheduledItems.length} scheduled item${scheduledItems.length === 1
      ? ""
      : "s"}`);
    return scheduledItems;
  },
};
