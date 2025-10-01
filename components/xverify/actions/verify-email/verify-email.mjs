import app from "../../xverify.app.mjs";

export default {
  key: "xverify-verify-email",
  name: "Verify Email",
  description: "Sends an email verification request. [See the documentation](https://apidocs.xverify.com/#email-verification-api-endpoint).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    ip: {
      type: "string",
      label: "IP Address",
      description: "IP address from which a user submitted an email address. Can be used to detect fraudulent or risky submissions.",
      optional: true,
    },
    ua: {
      type: "string",
      label: "User Agent",
      description: "User Agent of the browser that submitted the email address. Can be used to detect fraudlent or risky data.",
      optional: true,
    },
    aff: {
      propDefinition: [
        app,
        "aff",
      ],
    },
    subaff: {
      propDefinition: [
        app,
        "subaff",
      ],
    },
  },
  methods: {
    verifyEmail(args = {}) {
      return this.app._makeRequest({
        path: "/ev",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      verifyEmail,
      domain,
      email,
      ip,
      ua,
      aff,
      subaff,
    } = this;

    const response = await verifyEmail({
      $,
      params: {
        domain,
        email,
        ip,
        ua,
        aff,
        subaff,
      },
    });

    $.export("$summary", `Successfully sent email verification with status \`${response.status}\`.`);
    return response;
  },
};
