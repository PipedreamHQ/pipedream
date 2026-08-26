// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import createDepartment from "@pipedream/ramp/actions/create-department/create-department.mjs";

export default {
  ...createDepartment,
  key: "ramp_sandbox-create-department",
  name: "Create Department",
  description: "Create a new Ramp Sandbox department. [See the documentation](https://docs.ramp.com/developer-api/v1/api/departments#post-developer-v1-departments).",
  version: "0.0.1",
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
