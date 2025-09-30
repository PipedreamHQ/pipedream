import app from "../../xverify.app.mjs";

export default {
  key: "xverify-verify-phone",
  name: "Verify Phone",
  description: "Sends a phone verification request. [See the documentation](https://apidocs.xverify.com/#phone-verification-api-endpoint).",
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
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
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
    verifyPhone(args = {}) {
      return this.app._makeRequest({
        path: "/pv",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      verifyPhone,
      domain,
      phone,
      aff,
      subaff,
    } = this;

    const response = await verifyPhone({
      $,
      params: {
        domain,
        phone,
        aff,
        subaff,
      },
    });

    $.export("$summary", `Successfully sent verification with status \`${response.status}\`.`);
    return response;
  },
};
