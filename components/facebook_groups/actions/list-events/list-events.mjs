import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-list-events",
  name: "List Events",
  description: "Retrieves a list of events in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/group/events)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    maxResults: {
      propDefinition: [
        common.props.facebookGroups,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const events = await this.getResources({
      fn: this.facebookGroups.listEvents,
      args: {
        groupId: this.group,
        $,
      },
      maxResults: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}`);

    return events;
  },
};
