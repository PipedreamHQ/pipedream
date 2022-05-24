// legacy_hash_id: a_3Lie1M
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-create-tracked-event",
  name: "Create Tracked Event",
  description: "Tracks an event using event tracking.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    key: {
      type: "string",
      description: "This value is unique to your ActiveCampaign account and can be found named \"Event Key\" on Settings > Tracking > Event Tracking inside your ActiveCampaign account.",
    },
    event: {
      type: "string",
      description: "The name of the event you wish to track.",
    },
    actid: {
      type: "string",
      description: "This value is unique to your ActiveCampaign account and can be found named \"actid\" on Settings > Tracking > Event Tracking API.",
    },
    visit_email_address: {
      type: "string",
      description: "The url encoded email address of the contact you wish to track this event for. (e.g. visit={\"email\":\"email_address_here\"})",
    },
    eventdata: {
      type: "string",
      description: "A value you wish to store for the event.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#track-event
  // Note: Event Tracking must be enabled on in your ActiveCampaign account on Settings > Tracking > Event Tracking

    if (!this.key || !this.event || !this.actid || !this.visit_email_address) {
      throw new Error("Must provide key, event, actid, and visit_email_address parameters.");
    }

    const config = {
      method: "post",
      url: "https://trackcmp.net/event",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        actid: this.actid,
        key: this.key,
        event: this.event,
        eventdata: this.eventdata,
        visit: {
          email: encodeURIComponent(this.visit_email_address),
        },
      },
    };

    return await axios($, config);
  },
};
