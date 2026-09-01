// x-pd-ai: optimized
import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-create-department",
  name: "Create Department",
  description: "Create a new Ramp department (e.g. `Engineering`, `Marketing`). Use this to add an organizational unit before assigning users to it. Returns the new department's `id`, which you can pass to **Update User** to set a user's department, or use to filter **List Transactions** / **List Users**. [See the documentation](https://docs.ramp.com/developer-api/v1/api/departments#post-developer-v1-departments)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ramp,
    name: {
      propDefinition: [
        ramp,
        "name",
      ],
      description: "The name of the new department (e.g. `Engineering`, `Marketing`).",
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
