import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-list-departments",
  name: "List Departments",
  description: "Retrieve a list of Ramp departments. Use this to find department IDs for other actions such as **Update User** and **List Transactions**. Example: returns `{ id, name }` pairs such as `{ \"name\": \"Engineering\" }`. Returns one page of up to `pageSize` results (max 100); a `page.next` value in the response means more departments exist beyond this page. [See the documentation](https://docs.ramp.com/developer-api/v1/api/departments#get-developer-v1-departments).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
  async run({ $ }) {
    const response = await this.ramp.listDepartments({
      $,
      params: {
        page_size: this.pageSize,
        start: this.start,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} department(s)`);
    return response;
  },
};
