// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import listDepartments from "@pipedream/ramp/actions/list-departments/list-departments.mjs";

export default {
  ...listDepartments,
  key: "ramp_sandbox-list-departments",
  name: "List Departments",
  description: "Retrieve a list of Ramp Sandbox departments. Use this to find department IDs for other actions such as **Update User** and **List Transactions**. Example: returns `{ id, name }` pairs such as `{ \"id\": \"fffe6c22-698f-4dc5-b2b1-b35f86947d90\", \"name\": \"Engineering\" }` — pass the `id` to **Update User** to set a user's department. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more departments exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/departments#get-developer-v1-departments)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ramp,
    pageSize: {
      propDefinition: [
        ramp,
        "pageSize",
      ],
    },
    start: {
      propDefinition: [
        ramp,
        "start",
      ],
    },
  },
};
