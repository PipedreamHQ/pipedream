import common from "../common/common.mjs";

const { googleAds } = common.props;

export default {
  ...common,
  key: "google_ads-new-lead-form-entry",
  name: "New Lead Form Entry",
  description: "Emit new event for new leads on a Lead Form. [See the documentation](https://developers.google.com/google-ads/api/fields/v16/lead_form_submission_data)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
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
