import sourceforge from "../../sourceforge.app.mjs";

export default {
  key: "sourceforge-list-projects",
  name: "List Projects",
  description: "Retrieves a list of projects in an account. [See the documentation](https://anypoint.mulesoft.com/apiplatform/sourceforge/#/portals/organizations/98f11a03-7ec0-4a34-b001-c1ca0e0c45b1/apis/32951/versions/34322)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sourceforge,
  },
  async run({ $ }) {
    const userProjects = await this.sourceforge.listProjects({
      $,
    });

    const projects = [];
    for (const project of userProjects) {
      const projectInfo = await this.sourceforge.getProject({
        project: project.name,
        $,
      });
      projects.push(projectInfo);
    }

    $.export("$summary", `Successfully retrieved ${projects.length} project${projects.length === 1
      ? ""
      : "s" }`);

    return projects;
  },
};
