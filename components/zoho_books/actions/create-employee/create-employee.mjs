// legacy_hash_id: a_rJiaL2
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-create-employee",
  name: "Create Employee",
  description: "Creates an employee for an expense. [See the documentation](https://www.zoho.com/books/api/v3/expenses/#create-an-employee)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoBooks,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the employee.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the employee.",
    },
  },
  async run({ $ }) {
    const response = await this.zohoBooks.createEmployee({
      $,
      data: {
        name: this.name,
        email: this.email,
      },
    });

    $.export("$summary", `Employee successfully created with Id: ${response.employee.employee_id}`);
    return response;
  },
};
