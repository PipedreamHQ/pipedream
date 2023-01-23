import _ from "lodash";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-find-create-company",
  name: "Find Or Create Company",
  version: "0.0.1",
  description: "Find a company or create it if it doesn't exists [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
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
    let responseArray = [];

    do {
      const { company } = await this.roll.makeRequest({
        variables: {
          ..._.pickBy(variables),
          limit,
          offset,
        },
        query: "listCompanies",
      });

      companyLength = company.length;
      responseArray.push(...company);
      offset += limit;
    } while (companyLength);

    let summary = "Companies successfully fetched!";

    if (!responseArray.length) {
      responseArray = await this.roll.makeRequest({
        variables: _.pickBy(variables),
        query: "addCompany",
      });

      const { addCompany: { CompanyId } } = responseArray;
      summary = `Company successfully created with Id ${CompanyId}!`;
    }

    $.export("$summary", summary);
    return responseArray;
  },
};
