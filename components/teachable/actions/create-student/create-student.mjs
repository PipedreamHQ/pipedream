import teachable from "../../teachable.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "teachable-create-student",
  name: "Create Student",
  description: "Creates a new student. [See the documentation](https://docs.teachable.com/reference/createuser)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teachable,
    email: {
      propDefinition: [
        teachable,
        "email",
      ],
    },
    name: {
      propDefinition: [
        teachable,
        "name",
      ],
    },
    src: {
      propDefinition: [
        teachable,
        "src",
      ],
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password of the new user. Must be at least 6 characters. If no password is set, the student will be sent an email to set a password and confirm their account.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { users } = await this.teachable.listUsers({
      params: {
        email: this.email,
      },
      $,
    });

    if (users?.length) {
      throw new ConfigurationError(`User with email ${this.email} already exists.`);
    }

    const student = await this.teachable.createStudent({
      data: {
        email: this.email,
        name: this.name,
        src: this.src,
        password: this.password,
      },
      $,
    });

    if (student.id) {
      $.export("$summary", `Successfully created student with ID ${student.id}.`);
    }

    return student;
  },
};
