import app from "../../livestorm.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "livestorm-list-attendees-from-event",
  name: "List Attendees From Event",
  description: "List all the people linked to all the sessions of an event. [See the Documentation](https://developers.livestorm.co/reference/get_events-id-people)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    eventId: {
      propDefinition: [
        app,
        "eventId",
      ],
    },
    roleFilter: {
      type: "string",
      label: "Role Filter",
      description: "Filter the people by their role in the event.",
      options: Object.values(constants.ROLE),
      optional: true,
    },
  },
  methods: {
    listAttendeesFromEvent({
      eventId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/events/${eventId}/people`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const stream = this.app.getResourcesStream({
      resourceFn: this.listAttendeesFromEvent,
      resourceFnArgs: {
        step,
        eventId: this.eventId,
        params: {
          ["filter[role]"]: this.roleFilter,
        },
      },
    });

    const resources = await utils.streamIterator(stream);

    step.export("$summary", `Successfully retrieved ${utils.summaryEnd(resources.length, "attendee")}.`);

    return resources;
  },
};
