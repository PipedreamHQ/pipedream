import intellihr from "../../intellihr.app.mjs";

export default {
  key: "intellihr-update-person",
  name: "Update Person",
  description: "Modifies an existing person's record in intellihr",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    intellihr,
    personId: {
      propDefinition: [
        intellihr,
        "personId",
      ],
    },
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
    department: {
      propDefinition: [
        intellihr,
        "department",
      ],
      optional: true,
    },
    position: {
      propDefinition: [
        intellihr,
        "position",
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        intellihr,
        "startDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      department: this.department,
      position: this.position,
      start_date: this.startDate,
    };

    const response = await this.intellihr.updatePerson({
      personId: this.personId,
      data,
    });

    $.export("$summary", `Successfully updated person with ID: ${this.personId}`);
    return response;
  },
};
