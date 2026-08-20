import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-create-department",
  name: "Create Department",
  description: "Create a new Ramp department. [See the documentation](https://docs.ramp.com/developer-api/v1/api/departments#post-developer-v1-departments).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ramp,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new department (e.g. `Engineering`).",
    },
  },
  async run({ $ }) {
    const response = await this.ramp.createDepartment({
      $,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully created department "${this.name}" with ID ${response.id}`);
    return response;
  },
};
