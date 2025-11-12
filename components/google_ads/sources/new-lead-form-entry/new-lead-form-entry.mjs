import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

const { googleAds } = common.props;

export default {
  ...common,
  key: "google_ads-new-lead-form-entry",
  name: "New Lead Form Entry",
  description: "Emit new event for new leads on a Lead Form. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  props: {
    ...common.props,
    leadFormId: {
      propDefinition: [
        googleAds,
        "leadFormId",
        (({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        })),
      ],
    },
    docsAlert: {
      type: "alert",
      alertType: "info",
      content: "If needed, see Google's documentation on [submission fields](https://developers.google.com/google-ads/api/reference/rpc/v21/LeadFormSubmissionField) and [custom submission fields](https://developers.google.com/google-ads/api/reference/rpc/v21/CustomLeadFormSubmissionField).",
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New Lead";
    },
    getItems() {
      const {
        accountId, customerClientId, leadFormId,
      } = this;
      return this.googleAds.getLeadFormData({
        accountId,
        customerClientId,
        leadFormId,
      });
    },
  },
};
