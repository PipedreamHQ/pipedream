import app from "../../opensrs.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "opensrs-register-domain",
  name: "Register Domain",
  description: "Register a new domain. [See the documentation](https://domains.opensrs.guide/docs/sw_register-domain-or-trust_service-).",
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
    regUsername: {
      type: "string",
      label: "Reseller Username",
      description: "Usernames must be 3-20 characters in length. You can use any of the following alphanumeric characters: `A-Z`, `a-z`, `0-9`.",
    },
    regPassword: {
      type: "string",
      label: "Reseller Password",
      description: "Passwords must be 10-20 characters in length. You can use any of the following alphanumeric characters and symbols: `A-Z`, `a-z`, `0-9`, `! @$^,.~|=-+_{}#`.",
    },
    ownerFirstName: {
      type: "string",
      label: "Owner First Name",
      description: "The first name of the owner of the domain.",
    },
    ownerLastName: {
      type: "string",
      label: "Owner Last Name",
      description: "The last name of the owner of the domain.",
    },
    ownerEmail: {
      type: "string",
      label: "Owner Email",
      description: "The email of the owner of the domain.",
    },
    ownerOrgName: {
      type: "string",
      label: "Owner Organization Name",
      description: "The organization name of the owner of the domain.",
      optional: true,
    },
    ownerPhone: {
      type: "string",
      label: "Owner Phone",
      description: "The phone number of the owner of the domain.",
    },
    ownerAddress1: {
      type: "string",
      label: "Owner Address 1",
      description: "The first line of the address of the owner of the domain.",
    },
    ownerCity: {
      type: "string",
      label: "Owner City",
      description: "The city of the owner of the domain.",
    },
    ownerCountry: {
      type: "string",
      label: "Owner Country",
      description: "The country of the owner of the domain.",
    },
    ownerState: {
      type: "string",
      label: "Owner State",
      description: "The state of the owner of the domain.",
    },
    ownerPostalCode: {
      type: "string",
      label: "Owner Postal Code",
      description: "The postal code of the owner of the domain.",
    },
    adminFirstName: {
      type: "string",
      label: "Admin First Name",
      description: "The first name of the admin of the domain.",
    },
    adminLastName: {
      type: "string",
      label: "Admin Last Name",
      description: "The last name of the admin of the domain.",
    },
    adminEmail: {
      type: "string",
      label: "Admin Email",
      description: "The email of the admin of the domain.",
    },
    adminOrgName: {
      type: "string",
      label: "Admin Organization Name",
      description: "The organization name of the admin of the domain.",
      optional: true,
    },
    adminPhone: {
      type: "string",
      label: "Admin Phone",
      description: "The phone number of the admin of the domain.",
    },
    adminAddress1: {
      type: "string",
      label: "Admin Address 1",
      description: "The first line of the address of the admin of the domain.",
    },
    adminCity: {
      type: "string",
      label: "Admin City",
      description: "The city of the admin of the domain.",
    },
    adminCountry: {
      type: "string",
      label: "Admin Country",
      description: "The country of the admin of the domain.",
    },
    adminState: {
      type: "string",
      label: "Admin State",
      description: "The state of the admin of the domain.",
    },
    adminPostalCode: {
      type: "string",
      label: "Admin Postal Code",
      description: "The postal code of the admin of the domain.",
    },
    billingFirstName: {
      type: "string",
      label: "Billing First Name",
      description: "The first name of the billing contact of the domain.",
    },
    billingLastName: {
      type: "string",
      label: "Billing Last Name",
      description: "The last name of the billing contact of the domain.",
    },
    billingEmail: {
      type: "string",
      label: "Billing Email",
      description: "The email of the billing contact of the domain.",
    },
    billingOrgName: {
      type: "string",
      label: "Billing Organization Name",
      description: "The organization name of the billing contact of the domain.",
      optional: true,
    },
    billingPhone: {
      type: "string",
      label: "Billing Phone",
      description: "The phone number of the billing contact of the domain.",
    },
    billingAddress1: {
      type: "string",
      label: "Billing Address 1",
      description: "The first line of the address of the billing contact of the domain.",
    },
    billingCity: {
      type: "string",
      label: "Billing City",
      description: "The city of the billing contact of the domain.",
    },
    billingCountry: {
      type: "string",
      label: "Billing Country",
      description: "The country of the billing contact of the domain.",
    },
    billingState: {
      type: "string",
      label: "Billing State",
      description: "The state of the billing contact of the domain.",
    },
    billingPostalCode: {
      type: "string",
      label: "Billing Postal Code",
      description: "The postal code of the billing contact of the domain.",
    },
    techFirstName: {
      type: "string",
      label: "Tech First Name",
      description: "The first name of the tech contact of the domain.",
    },
    techLastName: {
      type: "string",
      label: "Tech Last Name",
      description: "The last name of the tech contact of the domain.",
    },
    techEmail: {
      type: "string",
      label: "Tech Email",
      description: "The email of the tech contact of the domain.",
    },
    techOrgName: {
      type: "string",
      label: "Tech Organization Name",
      description: "The organization name of the tech contact of the domain.",
      optional: true,
    },
    techPhone: {
      type: "string",
      label: "Tech Phone",
      description: "The phone number of the tech contact of the domain.",
    },
    techAddress1: {
      type: "string",
      label: "Tech Address 1",
      description: "The first line of the address of the tech contact of the domain.",
    },
    techCity: {
      type: "string",
      label: "Tech City",
      description: "The city of the tech contact of the domain.",
    },
    techCountry: {
      type: "string",
      label: "Tech Country",
      description: "The country of the tech contact of the domain.",
    },
    techState: {
      type: "string",
      label: "Tech State",
      description: "The state of the tech contact of the domain.",
    },
    techPostalCode: {
      type: "string",
      label: "Tech Postal Code",
      description: "The postal code of the tech contact of the domain.",
    },
    customTechContact: {
      type: "string",
      label: "Custom Tech Contact",
      description: "An indication of whether to use the RSP's tech contact info, or the tech contact info provided n the request.",
      default: "0",
      options: [
        {
          label: "Use reseller's tech contact info.",
          value: "0",
        },
        {
          label: "Use tech contact info provided in request.",
          value: "1",
        },
      ],
    },
    autoRenew: {
      type: "string",
      label: "Auto Renew",
      description: "Whether to automatically renew the domain.",
      optional: true,
      options: [
        {
          label: "Do not auto-renew",
          value: "0",
        },
        {
          label: "Auto-renew",
          value: "1",
        },
      ],
    },
    period: {
      type: "string",
      label: "Period",
      description: "The length of the registration period. Allowed values are `1-10`, depending on the TLD, that is, not all registries allow for a 1-year registration. The default is `2`, which is valid for all TLDs.",
      default: "2",
      options: [
        {
          label: "1 Year",
          value: "1",
        },
        {
          label: "2 Years",
          value: "2",
        },
        {
          label: "3 Years",
          value: "3",
        },
        {
          label: "4 Years",
          value: "4",
        },
        {
          label: "5 Years",
          value: "5",
        },
        {
          label: "6 Years",
          value: "6",
        },
        {
          label: "7 Years",
          value: "7",
        },
        {
          label: "8 Years",
          value: "8",
        },
        {
          label: "9 Years",
          value: "9",
        },
        {
          label: "10 Years",
          value: "10",
        },
      ],
    },
    customNameservers: {
      type: "string",
      label: "Custom Nameservers",
      description: "Custom nameservers for the domain.",
      reloadProps: true,
      options: [
        {
          label: "Use reseller's default nameservers",
          value: "0",
        },
        {
          label: "Use nameservers provided in request",
          value: "1",
        },
      ],
    },
    jsonOutput: {
      type: "boolean",
      label: "JSON Output",
      description: "Whether to output the response in JSON format.",
      optional: true,
      default: true,
    },
  },
  additionalProps() {
    const { customNameservers } = this;
    if (customNameservers === "1") {
      return {
        nameserverList: {
          type: "string[]",
          label: "Nameserver List",
          description: "List of nameservers for the domain. Eg. `ns1.opensrs.net`, `ns2.opensrs.net`.",
        },
      };
    }
    return {};
  },
  methods: {
    getJsonBody() {
      const {
        domain,
        regUsername,
        regPassword,
        ownerFirstName,
        ownerLastName,
        ownerEmail,
        ownerOrgName,
        ownerPhone,
        ownerAddress1,
        ownerCity,
        ownerCountry,
        ownerState,
        ownerPostalCode,
        adminFirstName,
        adminLastName,
        adminEmail,
        adminOrgName,
        adminPhone,
        adminAddress1,
        adminCity,
        adminCountry,
        adminState,
        adminPostalCode,
        billingFirstName,
        billingLastName,
        billingEmail,
        billingOrgName,
        billingPhone,
        billingAddress1,
        billingCity,
        billingCountry,
        billingState,
        billingPostalCode,
        techFirstName,
        techLastName,
        techEmail,
        techOrgName,
        techPhone,
        techAddress1,
        techCity,
        techCountry,
        techState,
        techPostalCode,
        customTechContact,
        autoRenew,
        customNameservers,
        nameserverList,
        period,
      } = this;
      return {
        data_block: {
          dt_assoc: {
            item: [
              ...utils.addItem("protocol", constants.PROTOCOL.XCP),
              ...utils.addItem("object", constants.OBJECT_TYPE.DOMAIN),
              ...utils.addItem("action", constants.ACTION_TYPE.SW_REGISTER),
              {
                "@_key": "attributes",
                "dt_assoc": {
                  item: [
                    ...utils.addItem("domain", domain),
                    ...utils.addItem("reg_username", regUsername),
                    ...utils.addItem("reg_password", regPassword),
                    ...utils.addItem("reg_type", constants.REGISTRY_TYPE.NEW),
                    ...utils.addItem("custom_nameservers", customNameservers),
                    ...utils.addItem("period", period),
                    ...utils.addItem("auto_renew", autoRenew),
                    ...utils.addItemList(
                      "nameserver_list",
                      customNameservers === "1"
                        ? nameserverList || []
                        : constants.DEFAULT_NAMESERVER_LIST,
                    ),
                    ...utils.addItem("custom_tech_contact", customTechContact),
                    {
                      "@_key": "contact_set",
                      "dt_assoc": {
                        item: [
                          {
                            "@_key": "owner",
                            "dt_assoc": {
                              item: [
                                ...utils.addItem("first_name", ownerFirstName),
                                ...utils.addItem("last_name", ownerLastName),
                                ...utils.addItem("phone", ownerPhone),
                                ...utils.addItem("email", ownerEmail),
                                ...utils.addItem("address1", ownerAddress1),
                                ...utils.addItem("city", ownerCity),
                                ...utils.addItem("state", ownerState),
                                ...utils.addItem("country", ownerCountry),
                                ...utils.addItem("postal_code", ownerPostalCode),
                                ...utils.addItem("org_name", ownerOrgName),
                              ],
                            },
                          },
                          {
                            "@_key": "admin",
                            "dt_assoc": {
                              item: [
                                ...utils.addItem("first_name", adminFirstName),
                                ...utils.addItem("last_name", adminLastName),
                                ...utils.addItem("phone", adminPhone),
                                ...utils.addItem("email", adminEmail),
                                ...utils.addItem("address1", adminAddress1),
                                ...utils.addItem("city", adminCity),
                                ...utils.addItem("state", adminState),
                                ...utils.addItem("country", adminCountry),
                                ...utils.addItem("postal_code", adminPostalCode),
                                ...utils.addItem("org_name", adminOrgName),
                              ],
                            },
                          },
                          {
                            "@_key": "billing",
                            "dt_assoc": {
                              item: [
                                ...utils.addItem("first_name", billingFirstName),
                                ...utils.addItem("last_name", billingLastName),
                                ...utils.addItem("phone", billingPhone),
                                ...utils.addItem("email", billingEmail),
                                ...utils.addItem("address1", billingAddress1),
                                ...utils.addItem("city", billingCity),
                                ...utils.addItem("state", billingState),
                                ...utils.addItem("country", billingCountry),
                                ...utils.addItem("postal_code", billingPostalCode),
                                ...utils.addItem("org_name", billingOrgName),
                              ],
                            },
                          },
                          {
                            "@_key": "tech",
                            "dt_assoc": {
                              item: [
                                ...utils.addItem("first_name", techFirstName),
                                ...utils.addItem("last_name", techLastName),
                                ...utils.addItem("phone", techPhone),
                                ...utils.addItem("email", techEmail),
                                ...utils.addItem("address1", techAddress1),
                                ...utils.addItem("city", techCity),
                                ...utils.addItem("state", techState),
                                ...utils.addItem("country", techCountry),
                                ...utils.addItem("postal_code", techPostalCode),
                                ...utils.addItem("org_name", techOrgName),
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      };
    },
    registerDomain(args = {}) {
      return this.app.post(args);
    },
  },
  async run({ $ }) {
    const {
      registerDomain,
      getJsonBody,
      jsonOutput,
    } = this;

    const response = await registerDomain({
      $,
      jsonBody: getJsonBody(),
      jsonOutput,
    });

    $.export("$summary", "Successfully registered domain.");
    return response;
  },
};
