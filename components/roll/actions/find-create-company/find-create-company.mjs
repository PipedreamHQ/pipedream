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
      name,
      email,
      status,
    } = this;

    let companyLength = 0;
    let offset = 0;
    const limit = 50;
    let response = [];
    let filter = "";

    do {
      filter = "(\n";
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
      response.push(...company);
      offset += limit;
    } while (companyLength);

    let summary = "Companies successfully fetched!";

    if (!response.length) {
      response = await this.roll.addSchema({
        $,
        mutation: `addCompany
          ${filter}
        {
          CompanyId
        }`,
      });
      const { data: { addCompany: { CompanyId } } } = response;
      summary = `Company successfully created with Id ${CompanyId}!`;
    }

    $.export("$summary", summary);
    return response;
  },
};
