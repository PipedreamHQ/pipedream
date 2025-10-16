import { customProps } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import outreach from "../../outreach.app.mjs";

export default {
  key: "outreach-create-account",
  name: "Create Account",
  description: "Creates an account within Outreach. [See the documentation](https://developers.outreach.io/api/reference/tag/Account/#tag/Account/paths/~1accounts/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    outreach,
    buyerIntentScore: {
      type: "string",
      label: "Buyer Intent Score",
      description: "A custom score given to measure the quality of the account.",
      optional: true,
    },
    companyType: {
      type: "string",
      label: "Company Type",
      description: "A description of the company's type (e.g. \"Public Company\").",
      optional: true,
    },
    customId: {
      type: "string",
      label: "Custom Id",
      description: "A custom ID for the account, often referencing an ID in an external system.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A custom description of the account.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The company's website domain (e.g. \"www.acme.com\").",
      optional: true,
    },
    externalSource: {
      type: "string",
      label: "External Source",
      description: "The source of the resource's creation (e.g. \"outreach-api\").",
      optional: true,
    },
    followers: {
      type: "integer",
      label: "Followers",
      description: "The number of followers the company has listed on social media.",
      optional: true,
    },
    foundedAt: {
      type: "string",
      label: "Founded At",
      description: "The founding date of the company. Format: 'YYYY-MM-DDTHH:MM:SS.UUUZ'",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "A description of the company's industry (e.g. \"Manufacturing\").",
      optional: true,
    },
    linkedInEmployees: {
      type: "integer",
      label: "Linked In Employees",
      description: "The number of employees listed on the company's LinkedIn URL.",
      optional: true,
    },
    linkedInUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The company's LinkedIn URL.",
      optional: true,
    },
    locality: {
      type: "string",
      label: "Locality",
      description: "The company's primary geographic region (e.g. \"Eastern USA\").",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the company (e.g. \"Acme Corporation\").",
    },
    named: {
      type: "boolean",
      label: "Named",
      description: "A boolean value determining whether this is a \"named\" account or not. Only named accounts will show up on the collection index.",
      optional: true,
    },
    naturalName: {
      type: "string",
      label: "Natural Name",
      description: "The natural name of the company (e.g. \"Acme\").",
      optional: true,
    },
    numberOfEmployees: {
      type: "integer",
      label: "Number Of Employees",
      description: "The number of employees working at the company.",
      optional: true,
    },
    sharingTeamId: {
      propDefinition: [
        outreach,
        "sharingTeamId",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tag values associated with the account (e.g. [\"Enterprise\", \"Tier 1\"]).",
      optional: true,
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "The company's website URL (e.g. \"https://www.acme.com/contact\").",
      optional: true,
    },
    ...customProps,
  },
  async run({ $ }) {
    const {
      outreach,
      buyerIntentScore,
      tags,
      ...data
    } = this;

    const response = await outreach.createAccount({
      $,
      data: {
        data: {
          attributes: {
            buyerIntentScore: buyerIntentScore && parseFloat(buyerIntentScore),
            tags: tags && parseObject(tags),
            ...data,
          },
          type: "account",
        },
      },
    });

    $.export("$summary", `Successfully created account with Id: ${response.data.id}`);
    return response;
  },
};
