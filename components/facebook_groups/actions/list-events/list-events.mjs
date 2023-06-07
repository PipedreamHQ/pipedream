import facebookGroups from "../../facebook_groups.app.mjs";

export default {
  key: "facebook_groups-list-events",
  name: "List Events",
  description: "Retrieves a list of events in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/group/events)",
  version: "0.0.1",
  type: "action",
  props: {
    facebookGroups,
    group: {
      propDefinition: [
        facebookGroups,
        "group",
      ],
    },
    maxResults: {
      propDefinition: [
        facebookGroups,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = this.facebookGroups.paginate({
      fn: this.facebookGroups.listEvents,
      args: {
        groupId: this.group,
        $,
      },
    });

    const events = [];
    let count = 0;
    for await (const event of response) {
      events.push(event);
      if (this.maxResults && ++count === this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}`);

    return events;
  },
};
