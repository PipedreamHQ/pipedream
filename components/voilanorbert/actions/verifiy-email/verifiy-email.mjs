import common from "../common/base.mjs";

export default {
  ...common,
  key: "voilanorbert-verifiy-email",
  name: "Verify Email",
  description: `Verifies the given list of emails.
  In case your account does not have a sufficient Verify API balance the service will try to auto refill the balance by charging using the billing details of the account. If it fails to charge, an HTTP status code of 402 will be returned.
  [See the docs here](https://api.voilanorbert.com/2018-01-08/#verify-endpoint-post)`,
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    emails: {
      propDefinition: [
        common.props.voilanorbert,
        "emails",
      ],
    },
  },
  methods: {
    async processEvent({ $ }) {
      const { resume_url } = $.flow.suspend();
      return this.voilanorbert.verifyEmails({
        emails: this.emails.toString(),
        webhook: resume_url,
      });
    },
    getSummary() {
      return "Emails Successfully sent for verification!";
    },
  },
};
