import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-get-invitee",
  name: "Get Event Invitee",
  description: "Retrieve the full invitee resource (including `email`, `name`, `status`, `reschedule_url`, and `no_show`) via `GET /scheduled_events/{event_uuid}/invitees/{invitee_uuid}`. Use the returned `reschedule_url` to direct an invitee to self-reschedule. Run **List Events** to find event UUIDs, then **List Event Invitees** to find invitee UUIDs. Example: with `eventUuid` set to `a1b2c3d4-e5f6-7890-abcd-ef1234567890` and `inviteeUuid` set to `f7e6d5c4-b3a2-1098-fedc-ba9876543210`, returns that invitee's `email`, `name`, and `status: \"active\"`. [See the documentation](https://developer.calendly.com/api-docs/8305c0ccfac70-get-event-invitee).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    calendly,
    eventUuid: {
      type: "string",
      label: "Event UUID",
      description: "The UUID of the scheduled event (the `{event_uuid}` path segment, e.g. `a1b2c3d4-e5f6-7890-abcd-ef1234567890`). Run **List Events** first to obtain event UUIDs.",
    },
    inviteeUuid: {
      type: "string",
      label: "Invitee UUID",
      description: "The UUID of the invitee within that event (the `{invitee_uuid}` path segment, e.g. `f7e6d5c4-b3a2-1098-fedc-ba9876543210`). The invitee list is returned by **List Event Invitees**.",
    },
  },
  async run({ $ }) {
    const response = await this.calendly.getInvitee(this.eventUuid, this.inviteeUuid, $);
    $.export("$summary", `Retrieved invitee ${this.inviteeUuid} for event ${this.eventUuid}`);
    return response;
  },
};
