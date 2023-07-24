import loops from "../../loops_so.app.mjs";

export default {
  key: "loops_so-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the Documentation](https://loops.so/docs/add-users/api-reference#add)",
  version: "0.0.1",
  type: "action",
  props: {
    loops,
    email: {
      propDefinition: [
        loops,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        loops,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        loops,
        "lastName",
      ],
    },
    userGroup: {
      propDefinition: [
        loops,
        "userGroup",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.loops.createContact({
      data: {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        userGroup: this.userGroup,
      },
      $,
    });

    $.export("$summary", `Successfully created contact with ID ${response.id}.`);

    return response;
  },
};
