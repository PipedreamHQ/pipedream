import app from "../../prisma_management_api.app.mjs";

export default {
  name: "Get Prisma Postgres Regions",
  version: "1.0.0",
  key: "prisma_management_api-get-postgres-regions",
  description: "Retrieves a list of all available regions where Prisma Postgres databases can be deployed. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listRegions({
      $,
    });

    if (response) {
      const count = response.data?.length || 0;
      $.export("$summary", `Successfully retrieved ${count} available Postgres region${count !== 1 ? "s" : ""}`);
    }

    return response;
  },
};