import drata from "../../drata.app.mjs";
import _ from "lodash";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/VendorsPublicController_listVendors/";

export default {
  key: "drata-find-vendors",
  name: "Find Vendors",
  description: `Find Vendors. [See the documentation](${docsLink}).`,
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    drata,
    q: {
      type: "string",
      label: "Query",
      description: "Query to search for",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Filter data to vendors of this category",
      optional: true,
      options: [
        "ENGINEERING",
        "PRODUCT",
        "MARKETING",
        "CS",
        "SALES",
        "FINANCE",
        "HR",
        "ADMINISTRATIVE",
        "SECURITY",
      ],
    },
    risk: {
      type: "string",
      label: "Risk",
      description: "Filter data to vendors of this risk level",
      optional: true,
      options: [
        "NONE",
        "LOW",
        "MODERATE",
        "HIGH",
      ],
    },
    critical: {
      type: "boolean",
      label: "Critical",
      description: "Filter data to vendors depending on if it is considered critical",
      optional: true,
    },
    passwordPolicy: {
      type: "string",
      label: "Password Policy",
      description: "Filter data to vendors with this password policy",
      optional: true,
      options: [
        "USERNAME_PASSWORD",
        "SSO",
        "LDAP",
      ],
    },
    userId: {
      propDefinition: [
        drata,
        "personnelId",
      ],
      label: "User ID",
      description: "Filter data to a person responsible for vendors",
      optional: true,
    },
    withLastQuestionnaires: {
      type: "boolean",
      label: "With Last Questionnaires",
      description: "Add last questionnaires to vendors",
      optional: true,
    },
    isArchived: {
      type: "boolean",
      label: "Is Archived",
      description: "Get archived or unarchived vendors",
      optional: true,
    },
    renewalDate: {
      type: "string",
      label: "Renewal Date",
      description: "Vendor renewal ISO 8601 datetime. E.g. 2021-01-01T00:00:00.000Z",
      optional: true,
    },
    renewalScheduleType: {
      type: "string",
      label: "Renewal Schedule Type",
      description: "Vendor renewal schedule type",
      optional: true,
      options: [
        "ONE_MONTH",
        "TWO_MONTHS",
        "THREE_MONTHS",
        "SIX_MONTHS",
        "ONE_YEAR",
        "CUSTOM",
      ],
    },
    renewalDateStatus: {
      type: "string",
      label: "Renewal Date Status",
      description: "Vendor renewal status based on how close it is to the renewal due date",
      optional: true,
      options: [
        "NO_RENEWAL",
        "COMPLETED",
        "RENEWAL_DUE_SOON",
        "RENEWAL_DUE",
      ],
    },
  },
  async run({ $ }) {
    const params = _.pickBy(_.pick(this, [
      "q",
      "category",
      "risk",
      "critical",
      "passwordPolicy",
      "userId",
      "withLastQuestionnaires",
      "isArchived",
      "renewalDate",
      "renewalScheduleType",
      "renewalDateStatus",
    ]));

    const response = await this.drata.listVendors({
      $,
      paginate: true,
      params,
    });

    $.export("$summary", `Succesfully found ${response.data.length} vendors`);

    return response;
  },
};
