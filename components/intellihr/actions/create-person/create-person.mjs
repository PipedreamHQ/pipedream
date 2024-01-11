import intellihr from "../../intellihr.app.mjs";

export default {
  key: "intellihr-create-person",
  name: "Create Person",
  description: "Creates a new individual record in intellihr. [See the documentation](https://developers.intellihr.io/docs/v1/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    intellihr,
    firstName: intellihr.propDefinitions.firstName,
    lastName: intellihr.propDefinitions.lastName,
    email: intellihr.propDefinitions.email,
    department: {
      ...intellihr.propDefinitions.department,
      optional: true,
    },
    position: {
      ...intellihr.propDefinitions.position,
      optional: true,
    },
    startDate: {
      ...intellihr.propDefinitions.startDate,
      optional: true,
    },
  },
  async run({ $ }) {
    const personData = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
    };

    if (this.department) {
      personData.department = this.department;
    }

    if (this.position) {
      personData.position = this.position;
    }

    if (this.startDate) {
      personData.start_date = this.startDate;
    }

    const response = await this.intellihr.createPerson({
      data: personData,
    });

    $.export("$summary", `Successfully created person: ${this.firstName} ${this.lastName}`);
    return response;
  },
};
