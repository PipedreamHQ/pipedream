import common from "../common/common-feed.mjs";
import constants from "../../common/constants.mjs";

const {
  FEED_COMMENT_MIN_FIELDS,
  OBJECT_TYPE,
} = constants;

export default {
  ...common,
  type: "source",
  name: "New Chatter Feed Comment (Instant or Polling)",
  key: "salesforce_rest_api-new-feed-comment",
  description: "Emit new events for each Chatter FeedComment (reply) created in Salesforce, polling `FeedComment` via SOQL on `CreatedDate`. Use this to react to comments on Chatter posts, since Chatter activity does not update the parent record's `LastModifiedDate`. The payload includes both `ParentId` (a polymorphic reference to the feed's parent - either a record feed, e.g. a Case ID starting with `500`, or a User feed) and `FeedItemId` (the ID of the FeedItem the comment belongs to) - these are distinct fields; do not confuse them. Set `parentObjectType` to a parent object API name (e.g. `Case`) to append `AND Parent.Type = '<value>'` to the SOQL WHERE clause. Set `excludeSelf` to `true` to drop comments authored by the connected integration user. Note: querying FeedComment without a parent filter requires the `View All Data` permission on the connected user. Attempts instant delivery via webhook and falls back to timer polling automatically. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_feedcomment.htm)",
  version: "0.0.1",
  props: {
    ...common.props,
    parentObjectType: {
      ...common.props.parentObjectType,
      description: "Optional. The Salesforce SObject API name of the parent business record to filter by, e.g. `Case`. When set, appends `AND Parent.Type = '<value>'` to the SOQL WHERE clause (traversal of the polymorphic `FeedComment.ParentId`). Leave blank to emit comments on any parent object (requires `View All Data` permission).",
    },
    excludeSelf: {
      ...common.props.excludeSelf,
      description: "Optional. When `true`, appends `AND CreatedById != '<authenticatedUserId>'` to filter out comments created by the connected user. The user ID is resolved at runtime via the userinfo endpoint and cached in db.",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.FEED_COMMENT;
    },
    getMinFields() {
      return FEED_COMMENT_MIN_FIELDS;
    },
  },
};
