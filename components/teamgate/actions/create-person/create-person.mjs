import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-create-person",
  name: "Create Person",
  version: "0.0.1",
  description: "Create a new person. [See the docs here](https://developers.teamgate.com/#6a612101-c0cb-404c-9442-29d07c352185)",
  type: "action",
  props: {
    teamgate,
    name: {
      propDefinition: [
        teamgate,
        "name",
      ],
      description: "The person's name.",
    },
    companies: {
      propDefinition: [
        teamgate,
        "companies",
      ],
      optional: true,
    },
    jobTitle: {
      propDefinition: [
        teamgate,
        "jobTitle",
      ],
      description: "The field will be set only if `companyId` is not empty.",
      optional: true,
    },
    customerStatusId: {
      propDefinition: [
        teamgate,
        "customerStatusId",
      ],
      description: "The status customer of the person.",
      optional: true,
    },
    prospectStatusId: {
      propDefinition: [
        teamgate,
        "prospectStatusId",
      ],
      optional: true,
      description: "The status prospects of the person",
    },
    starred: {
      propDefinition: [
        teamgate,
        "starred",
      ],
      description: "Indicator the lead is starred or not.",
      optional: true,
    },
    ownerId: {
      propDefinition: [
        teamgate,
        "ownerId",
      ],
      optional: true,
    },
    ownerUsername: {
      propDefinition: [
        teamgate,
        "ownerUsername",
      ],
      optional: true,
      description: "The username to which the deal belongs.",
    },
    ownerRandom: {
      propDefinition: [
        teamgate,
        "ownerRandom",
      ],
      optional: true,
    },
    sourceId: {
      propDefinition: [
        teamgate,
        "sourceId",
      ],
      optional: true,
    },
    source: {
      propDefinition: [
        teamgate,
        "source",
      ],
      optional: true,
    },
    sourceDescription: {
      propDefinition: [
        teamgate,
        "sourceDescription",
      ],
      optional: true,
    },
    industryId: {
      propDefinition: [
        teamgate,
        "industryId",
      ],
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "If the industry does not exist it will be created.",
      optional: true,
    },
    industryDescription: {
      type: "string",
      label: "Industry Description",
      description: "Will be set only if will be created new industry.",
      optional: true,
    },
    tags: {
      propDefinition: [
        teamgate,
        "tags",
      ],
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "A list of email objects. Example for string value: `{\"value\":\"john@example.net\",\"type\":\"work\"}` [Object format](https://developers.teamgate.com/#c3d764d8-af9b-46e6-be97-cc8d0264a376)",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "A list of phone objects. Example for string value: `{\"value\":\"+44 123 456 7890\",\"type\":\"mobile\"}` [Object format](https://developers.teamgate.com/#6a9c4d1a-c72a-4409-8041-afe30c64314c)",
      optional: true,
    },
    urls: {
      type: "string[]",
      label: "URLS",
      description: "A list of url objects. Example for string value: `{\"value\":\"https://facebook.com/example\",\"type\":\"facebook\"}` [Object format](https://developers.teamgate.com/#c4d7bd78-8b18-4b2e-9505-82f66f786455)",
      optional: true,
    },
    address: {
      type: "string[]",
      label: "Address",
      description: "A list of address objects. Example for string value: `{\"value\":{\"city\":\"Chicago\",\"countryIso\":\"USA\"}}` [Object format](https://developers.teamgate.com/#f1511aad-d3dc-4118-98d6-bed247321ea3)",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "Person's date of birth in YYY-MM-DD format.",
      optional: true,
    },
    personalNumber: {
      type: "string",
      label: "Personal Number",
      description: "Unique personal identification code.",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The person's gender.",
      optional: true,
      options: [
        "male",
        "female",
      ],
    },
    customFields: {
      propDefinition: [
        teamgate,
        "customFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      companies,
      jobTitle,
      customerStatusId,
      prospectStatusId,
      starred,
      ownerId,
      ownerUsername,
      ownerRandom,
      sourceId,
      source,
      sourceDescription,
      industryId,
      industry,
      industryDescription,
      tags,
      emails,
      phones,
      urls,
      address,
      birthday,
      personalNumber,
      gender,
      customFields,
    } = this;

    const data = {
      name,
      companyId: companies,
      jobTitle,
      customerStatusId,
      prospectStatusId,
      starred,
      ownerId,
      ownerUsername,
      ownerRandom,
      sourceId,
      source,
      sourceDescription,
      industryId,
      industry,
      industryDescription,
      tags,
      emails: emails.map((item) => (JSON.parse(item))),
      phones: phones.map((item) => (JSON.parse(item))),
      urls: urls.map((item) => (JSON.parse(item))),
      address: address.map((item) => (JSON.parse(item))),
      birthday,
      personalNumber,
      gender,
      customFields,
    };

    const response = await this.teamgate.createPerson({
      $,
      data,
    });

    $.export("$summary", "Person Successfully created!");
    return response;
  },
};
