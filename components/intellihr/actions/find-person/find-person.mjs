import intellihr from "../../intellihr.app.mjs";

export default {
  key: "intellihr-find-person",
  name: "Find Person",
  description: "Searches for a person in intellihr using their attributes. The action requires at least one identifying prop, like 'first_name', 'last_name', or 'email'. Multiple props can be used to narrow the search.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    intellihr,
    firstName: {
      propDefinition: [
        intellihr,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        intellihr,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        intellihr,
        "email",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.firstName && !this.lastName && !this.email) {
      throw new Error("At least one of 'first_name', 'last_name', or 'email' is required.");
    }

    const response = await this.intellihr.searchPerson({
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
      },
    });

    $.export("$summary", `Found ${response.length} person(s)`);
    return response;
  },
};
