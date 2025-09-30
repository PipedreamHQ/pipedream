import _ from "lodash";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-find-company",
  name: "Find Company",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    return responseArray;
  },
};
