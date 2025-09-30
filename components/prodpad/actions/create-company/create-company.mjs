import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-create-company",
  name: "Create Company",
  description: "Create a new company in the account. This is only available to accounts with an Advanced or higher subscription. If you try on an account without an advanced or higher subscription package it will return a 403. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/PostCompanies).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    size: {
      propDefinition: [
        app,
        "companySize",
      ],
    },
    value: {
      propDefinition: [
        app,
        "companyValue",
      ],
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "The tags to associate with the company.",
      optional: true,
      propDefinition: [
        app,
        "tagId",
      ],
    },
  },
  async run({ $: step }) {
    const {
      name,
      city,
      country,
      size,
      value,
      tagIds,
    } = this;

    const response = await this.app.createCompany({
      step,
      data: {
        name,
        city,
        country,
        size,
        value,
        tags: utils.mapOrParse(tagIds, (id) => ({
          id,
        })),
      },
    });

    step.export("$summary", `Successfully created company with ID ${response.id}.`);

    return response;
  },
};
