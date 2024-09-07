import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../linkedin_ads.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "linkedin_ads-new-lead-gen-form-created",
  name: "New Lead Gen Form Created",
  description: "Emit new event when a new lead is captured through a form. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/lead-sync/leadsync?view=li-lms-2023-07&tabs=http#find-lead-form-responses-by-owner)",
  version: "0.0.1",
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
    adAccountId: {
      propDefinition: [
        app,
        "adAccountId",
      ],
    },
    leadFormId: {
      propDefinition: [
        app,
        "leadFormId",
        ({ adAccountId }) => ({
          adAccountId,
        }),
      ],
    },
  },
  async run() {
    const {
      app,
      adAccountId,
      leadFormId,
    } = this;

    const { versionId: leadFormVersionId } = await app.getLeadForm({
      leadFormId,
    });

    const { elements } = await app.searchLeadFormResponses({
      params: {
        q: "owner",
        owner: `(sponsoredAccount:${app.getSponsoredAccountUrn(adAccountId)})`,
        leadType: "(leadType:SPONSORED)",
        limitedToTestLeads: false,
        versionedLeadGenFormUrn: app.getVersionedLeadGenFormUrn(leadFormId, leadFormVersionId),
      },
    });

    elements
      .reverse()
      .forEach((event) => {
        this.$emit(event, {
          id: event.id,
          summary: `New Lead Gen: ${event.id}`,
          ts: event.submittedAt,
        });
      });
  },
  sampleEmit,
};
