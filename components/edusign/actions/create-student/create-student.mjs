import edusign from "../../edusign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "edusign-create-student",
  name: "Create Student",
  description: "Registers a new student in the Edusign system. [See the documentation](https://ext.edusign.fr/doc/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    edusign,
    firstName: {
      propDefinition: [
        edusign,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        edusign,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        edusign,
        "email",
      ],
    },
    studentId: {
      propDefinition: [
        edusign,
        "studentId",
      ],
    },
    address: {
      propDefinition: [
        edusign,
        "address",
        (c) => ({
          optional: true,
        }),
      ],
    },
    phoneNumber: {
      propDefinition: [
        edusign,
        "phoneNumber",
        (c) => ({
          optional: true,
        }),
      ],
    },
    dateOfBirth: {
      propDefinition: [
        edusign,
        "dateOfBirth",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.edusign.registerStudent({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      studentId: this.studentId,
      address: this.address,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
    });

    $.export("$summary", `Successfully registered student ${this.firstName} ${this.lastName}`);
    return response;
  },
};
