import { parseObject } from "../../common/utils.mjs";
import gosquared from "../../gosquared.app.mjs";

export default {
  key: "gosquared-track-event",
  name: "Track Event",
  description: "Track an event in GoSquared. Events are a versatile way of tracking anything that is happening on your site or app. [See the documentation](https://www.gosquared.com/docs/tracking/event/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gosquared,
    siteToken: {
      propDefinition: [
        gosquared,
        "siteToken",
      ],
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event to track. Popular events are aggregated by name in the Trends dashboard.",
    },
    eventData: {
      type: "object",
      label: "Event Data",
      description: "Properties associated with this event. Note: event body data is not currently searchable, but it can be viewed on a per profile basis in People CRM.",
      optional: true,
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The People person ID that this action is associated with. If the identifier used is an email it should be prefixed with email: like this: email:jon@example.com",
      optional: true,
    },
    visitorId: {
      type: "string",
      label: "Visitor ID",
      description: "The anonymous visitor ID that this action is associated with.",
      optional: true,
    },
    pageUrl: {
      type: "string",
      label: "Page URL",
      description: "The URL of the page where the event occurred",
      optional: true,
    },
    pageTitle: {
      type: "string",
      label: "Page Title",
      description: "The title of the page where the event occurred",
      optional: true,
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "A valid ISO 8601 timestamp. If not provided, current time will be used.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gosquared.trackEvent({
      $,
      data: {
        event: {
          name: this.eventName,
          data: parseObject(this.eventData),
        },
        timestamp: this.timestamp,
        person_id: this.personId,
        visitor_id: this.visitorId,
        page: {
          url: this.pageUrl,
          title: this.pageTitle,
        },
      },
      params: {
        site_token: this.siteToken,
      },
    });

    $.export("$summary", `Successfully tracked event: ${this.eventName}`);
    return response;
  },
};

