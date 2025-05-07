import { ConfigurationError } from "@pipedream/platform";
import app from "../../plaid.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    products: {
      propDefinition: [
        app,
        "products",
      ],
    },
    requiredIfSupportedProducts: {
      propDefinition: [
        app,
        "requiredIfSupportedProducts",
      ],
    },
    optionalProducts: {
      propDefinition: [
        app,
        "optionalProducts",
      ],
    },
    additionalConsentedProducts: {
      propDefinition: [
        app,
        "additionalConsentedProducts",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        app,
        getCreateLinkTokenArgs,
        http: { endpoint: webhook },
      } = this;

      const response = await app.createLinkToken({
        user: {
          client_user_id: "pdTestUser",
        },
        client_name: "Pipedream App",
        language: "en",
        country_codes: [
          "US",
        ],
        products: [
          "transactions",
          "assets",
        ],
        webhook,
        ...getCreateLinkTokenArgs(),
      });
      console.log("createLinkToken response", response);
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getCreateLinkTokenArgs() {
      return {};
    },
    isEventRelevant() {
      return true;
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
  },
  async run({ body }) {
    const {
      // http,
      isEventRelevant,
      processResource,
    } = this;

    // http.respond({
    //   status: 200,
    // });

    if (isEventRelevant(body)) {
      processResource(body);
    }
  },
};
