import github from "../../github.app.mjs";

export default {
  key: "github-create-repository",
  name: "Create Repository",
  description: "Creates a new repository for the authenticated user. [See docs here](https://docs.github.com/en/rest/repos/repos#create-a-repository-for-the-authenticated-user)",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    name: {
      label: "Name",
      description: "The name of the repository.",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.github.createRepository({
      data: {
        name: this.name,
      },
    });

    $.export("$summary", `Successfully created repository ${response.full_name}.`);

    return response;
  },
};
