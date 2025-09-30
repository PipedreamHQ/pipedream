import _ from "lodash";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-find-create-company",
  name: "Find Or Create Company",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find a company or create it if it doesn't exists [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
    name: {
      propDefinition: [
        roll,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        roll,
        "email",
      ],
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
        type: "mutation",
      });

      const { addCompany: { CompanyId } } = responseArray;
      summary = `Company successfully created with Id ${CompanyId}!`;
    }

    $.export("$summary", summary);
    return responseArray;
  },
};
