import common from "../common-watch-for-resource-changes.mjs";

export default {
  ...common,
  type: "source",
  key: "snowflake-change-to-user",
  // eslint-disable-next-line
  name: "New, Updated, or Deleted User",
  description: "Emit new events when a user is created, altered, or dropped",
  version: "0.0.1",
  props: {
    ...common.props,
    users: {
      propDefinition: [
        common.props.snowflake,
        "users",
      ],
      optional: true,
    },
  },
  async run() {
    await this.watchObjectsAndEmitChanges("USER", this.users, this.queryTypes);
  },
};
