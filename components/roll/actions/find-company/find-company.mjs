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
      companyId,
      name,
      email,
      status,
    } = this;

    let companyLength = 0;
    let offset = 0;
    const limit = 50;
    const responseArray = [];

    do {
      let filter = "(\n";
      if (companyId) filter += `CompanyId: ${companyId}\n`;
      if (name) filter += `CompanyName: "${name}"\n`;
      if (email) filter += `CompanyEmail: "${email}"\n`;
      if (status) filter += `CompanyStatus: "${status}"\n`;
      filter += `limit: ${limit}
        offset: ${offset}
      )`;

      const { data: { company } } = await this.roll.listCompanies({
        $,
        filter,
      });
      companyLength = company.length;
      responseArray.push(...company);
      offset += limit;
    } while (companyLength);

    $.export("$summary", "Companies successfully fetched!");
    return {
      data: {
        company: responseArray,
      },
    };
  },
};
