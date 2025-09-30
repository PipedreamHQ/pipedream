import intellihr from "../../intellihr.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "intellihr-update-person",
  name: "Update Person",
  description: "Modifies an existing person's record in intellihr. [See the documentation](https://developers.intellihr.io/docs/v1/#tag/People/paths/~1people~1%7Bid%7D/patch)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    phone: {
      propDefinition: [
        intellihr,
        "phone",
      ],
    },
    dateOfBirth: {
      propDefinition: [
        intellihr,
        "dateOfBirth",
      ],
    },
    title: {
      propDefinition: [
        intellihr,
        "title",
      ],
    },
    employeeNumber: {
      propDefinition: [
        intellihr,
        "employeeNumber",
      ],
    },
    gender: {
      propDefinition: [
        intellihr,
        "gender",
      ],
    },
    workRightId: {
      propDefinition: [
        intellihr,
        "workRightId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.intellihr.updatePerson({
      personId: this.personId,
      data: utils.cleanObject({
        firstName: this.firstName,
        lastName: this.lastName,
        emailAddresses: this.email
          ? [
            {
              email: this.email,
              isPrimary: true,
            },
          ]
          : undefined,
        phoneNumbers: this.phone
          ? [
            {
              number: this.phone,
              isPrimary: true,
            },
          ]
          : undefined,
        dateOfBirth: this.dateOfBirth,
        title: this.title,
        employeeNumber: this.employeeNumber,
        gender: this.gender,
        workRight: this.workRightId
          ? {
            id: this.workRightId,
          }
          : undefined,
      }),
      $,
    });

    $.export("$summary", `Successfully updated person with ID: ${this.personId}`);
    return response;
  },
};
