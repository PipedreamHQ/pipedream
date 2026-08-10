// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "salesforce_rest_api-list-case-feed-items",
  name: "List Case Feed Items",
  description: "List the feed (Chatter) entries on a case, newest first."
    + " Use this to read a case's activity trail - text posts, status changes, logged calls, email events and case comment events - in one call."
    + " The case feed only exists when feed tracking is enabled for Cases in the Salesforce org, so an org without it returns no records."
    + " [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_associated_objects_feed.htm)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    salesforce,
    caseId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: constants.OBJECT_TYPE.CASE,
        }),
      ],
      label: "Case ID",
      description: "The ID of the case to retrieve feed items for (15- or 18-character Salesforce ID, e.g. `5005g00001ABCDeAAI`). Use the **List Cases* action to retrieve case IDs",
    },
    feedItemType: {
      type: "string",
      label: "Feed Item Type",
      description: "Return only feed items of this type. By default, feed items of all types are returned.",
      options: constants.CASE_FEED_ITEM_TYPES,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of feed items to return. Valid values are integers from 1 through 1000. Default is 100.",
      default: constants.FEED_DEFAULT_LIMIT,
      min: 1,
      max: constants.FEED_MAX_LIMIT,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!constants.SALESFORCE_ID_REGEX.test(this.caseId)) {
      throw new ConfigurationError("**Case ID** must be a 15- or 18-character Salesforce ID");
    }

    const fields = (await this.salesforce.getFieldsForObjectType(constants.OBJECT_TYPE.CASE_FEED))
      .map(({ name }) => name);

    let query = `SELECT ${fields.join(", ")} FROM ${constants.OBJECT_TYPE.CASE_FEED} WHERE ParentId = '${this.caseId}'`;
    if (this.feedItemType) {
      query += ` AND Type = '${this.feedItemType.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
    }
    query += ` ORDER BY CreatedDate DESC, Id DESC LIMIT ${this.limit || constants.FEED_DEFAULT_LIMIT}`;

    const { records } = await this.salesforce.query({
      $,
      query,
    });
    $.export("$summary", `Successfully retrieved ${records.length} feed item${records.length === 1
      ? ""
      : "s"} for case with ID ${this.caseId}`);
    return records;
  },
};
