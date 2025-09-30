import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-create-tracked-event",
  name: "Create Tracked Event",
  description: "Tracks an event using event tracking. See the docs [here](https://developers.activecampaign.com/reference/track-event).",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    activecampaign,
    key: {
      type: "string",
      label: "Key",
      description: "This value is unique to your ActiveCampaign account and can be found named \"Event Key\" on Settings > Tracking > Event Tracking inside your ActiveCampaign account.",
    },
    event: {
      type: "string",
      label: "Event",
      description: "The name of the event you wish to track.",
    },
    eventdata: {
      type: "string",
      label: "Event Data",
      description: "A value you wish to store for the event.",
      optional: true,
    },
    actid: {
      type: "string",
      label: "Act ID",
      description: "This value is unique to your ActiveCampaign account and can be found named \"actid\" on Settings > Tracking > Event Tracking API.",
    },
    visitEmail: {
      type: "string",
      label: "Visit Email",
      description: "Email address of the contact you wish to track this event for.",
    },
  },
  async run({ $ }) {
    const {
      key,
      event,
      eventdata,
      actid,
      visitEmail,
    } = this;

    const response = await this.activecampaign.trackEvent({
      data: {
        key,
        event,
        eventdata,
        actid,
        visit: {
          email: encodeURIComponent(visitEmail),
        },
      },
    });

    $.export("$summary", "Successfully created tracked event");

    return response;
  },
};
