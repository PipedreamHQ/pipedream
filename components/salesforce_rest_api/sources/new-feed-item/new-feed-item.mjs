import common from "../common/common-feed.mjs";
import constants from "../../common/constants.mjs";

const {
  FEED_ITEM_MIN_FIELDS,
  OBJECT_TYPE,
} = constants;

export default {
  ...common,
  type: "source",
  name: "New Chatter Feed Item (Instant or Polling)",
  key: "salesforce_rest_api-new-feed-item",
  description: "Emit new events for each Chatter FeedItem (post) created in Salesforce, polling `FeedItem` via SOQL on `CreatedDate`. Use this to react to Chatter posts on Cases and other records, since Chatter activity does not update the parent record's `LastModifiedDate` (so **New Record (Instant, of Selectable Type)** and **New Case (Instant, of Selectable Type)** never emit for it). Set `parentObjectType` to the parent object's API name (e.g. `Case`, `Opportunity`) to only emit posts whose parent record is of that type. Set `excludeSelf` to `true` to drop posts authored by the connected integration user. Note: `Body` is null for system-generated post types (e.g. `TrackedChange`). Attempts instant delivery via webhook and falls back to timer polling automatically when the Streaming API does not support this object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_feeditem.htm)",
  version: "0.0.3",
  props: {
    ...common.props,
    parentObjectType: {
      ...common.props.parentObjectType,
      description: "Optional. The Salesforce SObject API name of the parent record to filter by, e.g. `Case` or `Opportunity`. When set, appends `AND Parent.Type = '<value>'` to the SOQL WHERE clause (traversal of the polymorphic `FeedItem.ParentId`). Leave blank to emit posts on any parent object.",
    },
    excludeSelf: {
      ...common.props.excludeSelf,
      description: "Optional. When `true`, appends `AND CreatedById != '<authenticatedUserId>'` to filter out posts created by the connected user. The user ID is resolved at runtime via the userinfo endpoint and cached in db.",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.FEED_ITEM;
    },
    getMinFields() {
      return FEED_ITEM_MIN_FIELDS;
    },
  },
};
