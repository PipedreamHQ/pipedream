import app from "../../prisma_management_api.app.mjs";

export default {
  name: "List Projects in Prisma Workspace",
  version: "1.0.0",
  key: "prisma_management_api-list-projects-in-prisma-workspace",
  description: "List Projects in a Prisma Workspace via Prisma Management API. [See docs here](https://www.prisma.io/docs/postgres/introduction/management-api)",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listProjects({
      $,
    });

    if (response) {
      const items = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];
      const count = items.length;
      $.export("$summary", `Successfully retrieved ${count} project${count !== 1 ? "s" : ""}`);
    }

    return response;
  },
};