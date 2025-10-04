import app from "../../opensrs.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "opensrs-initiate-domain-transfer",
  name: "Initiate Domain Transfer",
  description: "Initiate a domain transfer to OpenSRS. [See the documentation](https://domains.opensrs.guide/docs/trade_domain).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      type: "string",
      label: "Email",
      description: "The email address of the new owner of the domain.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the new owner of the domain.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the new owner of the domain.",
    },
    orgName: {
      type: "string",
      label: "Organization Name",
      description: "The organization name of the new owner of the domain.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the new owner of the domain. Required for all except `.BE`.",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "The first line of the address of the new owner of the domain. Required for all except `.BE`.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the new owner of the domain. Required for all except `.BE`.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the new owner of the domain. Required for all except `.BE`.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the new owner of the domain. Required for all except `.BE`.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the new owner of the domain. Required for all except `.BE`.",
      optional: true,
    },
    domainAuthInfo: {
      type: "string",
      label: "Domain Authorization Info",
      description: "The authorization code required for domain transfer. Required for `.BE`.",
      optional: true,
    },
    jsonOutput: {
      type: "boolean",
      label: "JSON Output",
      description: "Whether to output the response in JSON format.",
      optional: true,
      default: true,
    },
  },
  methods: {
    getJsonBody() {
      const {
        domain,
        email,
        firstName,
        lastName,
        orgName,
        phone,
        address1,
        city,
        country,
        state,
        postalCode,
        domainAuthInfo,
      } = this;

      return {
        data_block: {
          dt_assoc: {
            item: [
              ...utils.addItem("protocol", constants.PROTOCOL.XCP),
              ...utils.addItem("object", constants.OBJECT_TYPE.DOMAIN),
              ...utils.addItem("action", constants.ACTION_TYPE.TRADE_DOMAIN),
              {
                "@_key": "attributes",
                "dt_assoc": {
                  item: [
                    ...utils.addItem("domain", domain),
                    ...utils.addItem("email", email),
                    ...utils.addItem("first_name", firstName),
                    ...utils.addItem("last_name", lastName),
                    ...utils.addItem("org_name", orgName),
                    ...utils.addItem("phone", phone),
                    ...utils.addItem("address1", address1),
                    ...utils.addItem("city", city),
                    ...utils.addItem("country", country),
                    ...utils.addItem("state", state),
                    ...utils.addItem("postal_code", postalCode),
                    ...utils.addItem("domain_auth_info", domainAuthInfo),
                  ],
                },
              },
            ],
          },
        },
      };
    },
    initiateDomainTransfer(args = {}) {
      return this.app.post(args);
    },
  },
  async run({ $ }) {
    const {
      initiateDomainTransfer,
      getJsonBody,
      jsonOutput,
    } = this;

    const response = await initiateDomainTransfer({
      $,
      jsonBody: getJsonBody(),
      jsonOutput,
    });

    $.export("$summary", "Successfully initiated domain transfer.");
    return response;
  },
};
