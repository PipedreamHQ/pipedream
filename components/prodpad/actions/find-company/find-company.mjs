import app from "../../prodpad.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "prodpad-find-company",
  name: "Find Company",
  description: "Finds a company. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/GetCompanies).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    name: {
      description: "Filter the companies by the name or partial name of the companies.",
      optional: true,
      propDefinition: [
        app,
        "name",
      ],
    },
    city: {
      description: "Set to filter the companies based on city.",
      propDefinition: [
        app,
        "city",
      ],
    },
    country: {
      description: "Set to filter the companies based on the country. Use ISO Alpha-2 country codes. Only one country can be filtered at a time.",
      propDefinition: [
        app,
        "country",
      ],
    },
    companySize: {
      description: "Set to filter the companies based on their size.",
      propDefinition: [
        app,
        "companySize",
      ],
    },
    companyValue: {
      description: "Set to filter the companies based on their value.",
      propDefinition: [
        app,
        "companyValue",
      ],
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "Filter companies by the tags associated to the feedback. Mulitple tags can be specified and acts as an OR. Use the tag ID or UUID.",
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
      companySize,
      companyValue,
      tagIds,
    } = this;

    const { companies } = await this.app.listCompanies({
      step,
      params: {
        name,
        city,
        country,
        company_size: companySize,
        value: companyValue,
        tags: utils.mapOrParse(tagIds).join(","),
      },
    });

    step.export("$summary", `Successfully found ${utils.summaryEnd(companies.length, "company", "companies")}`);

    return companies;
  },
};
