import _ from "lodash";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-find-company",
  name: "Find Company",
  version: "0.0.1",
  description: "Find a company [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
    companyId: {
      propDefinition: [
        roll,
        "companyId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The company's name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The company's contact email.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The company's status.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      roll,
      ...variables
    } = this;

    let companyLength = 0;
    let offset = 0;
    const limit = 50;
    const responseArray = [];

    do {
      const { company } = await this.roll.makeRequest({
        variables: {
          ..._.pickBy(variables),
          limit,
          offset,
        },
        query: "listCompanies",
      });

      offset += limit;
      companyLength = company.length;
      responseArray.push(...company);
    } while (companyLength);

    $.export("$summary", "Companies successfully fetched!");
    return {
      data: {
        company: responseArray,
      },
    };
  },
};
