import intellihr from "../../intellihr.app.mjs";

export default {
  key: "intellihr-create-person",
  name: "Create Person",
  description: "Creates a new individual record in intellihr. [See the documentation](https://developers.intellihr.io/docs/v1/#tag/People/paths/~1people/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intellihr,
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
    },
    email: {
      propDefinition: [
        intellihr,
        "email",
      ],
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
    const { data } = await this.intellihr.createPerson({
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        emailAddresses: [
          {
            email: this.email,
            isPrimary: this.email,
          },
        ],
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
      },
      $,
    });

    $.export("$summary", `Successfully created person: ${data.displayName}`);
    return data;
  },
};
