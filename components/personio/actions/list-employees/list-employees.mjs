import personio from "../../personio.app.mjs";

export default {
  key: "personio-list-employees",
  name: "List Employees",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get a list of the company employees. [See the documentation](https://developer.personio.de/reference/get_company-employees)",
  type: "action",
  props: {
    personio,
    email: {
      propDefinition: [
        personio,
        "email",
      ],
      description: "Find an employee with the given email address. The response is still a list, containing only the filtered employee. `NOTE: when using the updated_since filter, the email filter is ignored`.",
      optional: true,
    },
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "Find all employees that have been updated since the provided date. The format is ISO 8601 (2022-12-24T08:15:30). `NOTE: when using the updated_since filter, the email, limit, and offset parameters are ignored`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      personio,
      email,
      updatedSince,
    } = this;

    const params = {
      email,
    };
    if (updatedSince) params.updated_since = updatedSince;

    const items = await personio.paginate({
      fn: personio.listEmployees,
      params,
    });

    let responseArray = [];

    for await (const item of items) {
      responseArray.push(item);
    }

    $.export("$summary", `${responseArray.length} employee${responseArray.length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return responseArray;
  },
};
