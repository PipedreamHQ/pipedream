import remote from "../../remote.app.mjs";

export default {
  key: "remote-list-employments",
  name: "List Employments",
  description: "List employments in Remote. [See the documentation](https://developer.remote.com/reference/get_index_employment)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    remote,
    email: {
      type: "string",
      label: "Email",
      description: "Filters the results by employments whose login email matches the value",
      optional: true,
    },
    employmentType: {
      type: "string",
      label: "Employment Type",
      description: "Filters the results by employments whose employment product type matches the value",
      optional: true,
      options: [
        "contractor",
        "direct_employee",
        "employee",
      ],
    },
    employmentModel: {
      type: "string",
      label: "Employment Model",
      description: "Filters the results by employments whose employment model matches the value",
      optional: true,
      options: [
        "global_payroll",
        "peo",
        "eor",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.remote.paginate({
      $,
      dataKey: "employments",
      fn: this.remote.listEmployments,
      params: {
        email: this.email,
        employment_type: this.employmentType,
        employment_model: this.employmentModel,
      },
      maxResults: this.maxResults,
    });

    const responseArray = [];
    for await (const employment of response) {
      responseArray.push(employment);
    }

    $.export("$summary", `Successfully listed ${responseArray.length} employments`);
    return responseArray;
  },
};
