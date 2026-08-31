// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import createDepartment from "@pipedream/ramp/actions/create-department/create-department.mjs";

export default {
  ...createDepartment,
  key: "ramp_sandbox-create-department",
  name: "Create Department",
  description: "Create a new Ramp Sandbox department (e.g. `Engineering`, `Marketing`). Use this to add an organizational unit before assigning users to it. Returns the new department's `id`, which you can pass to **Update User** to set a user's department, or use to filter **List Transactions** / **List Users**. [See the documentation](https://docs.ramp.com/developer-api/v1/api/departments#post-developer-v1-departments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
};
