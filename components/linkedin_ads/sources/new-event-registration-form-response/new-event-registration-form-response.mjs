import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../linkedin_ads.app.mjs";

export default {
  key: "linkedin_ads-new-event-registration-form-response",
  name: "New Event Registration Form Response",
  description: "Emit new event when a fresh response is received on the event registration form. User needs to configure the prop of the specific event. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/events?view=li-lms-2024-01&tabs=http)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    eventId: {
      propDefinition: [
        app,
        "eventId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
  },
  async run() {
    const {
      app,
      organizationId,
      eventId,
    } = this;

    const { elements } = await app.searchLeadFormResponses({
      params: {
        q: "owner",
        owner: `(organization:${app.getOrganizationUrn(organizationId)})`,
        leadType: "(leadType:EVENT)",
        limitedToTestLeads: false,
        associatedEntity: app.getEventUrn(eventId),
      },
    });

    elements
      .reverse()
      .forEach((event) => {
        this.$emit(event, {
          id: event.id,
          summary: `New Event Registration: ${event.id}`,
          ts: event.submittedAt,
        });
      });
  },
};
