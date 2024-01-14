import loops from "../../loops_so.app.mjs";

export default {
  key: "loops_so-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the Documentation](https://loops.so/docs/add-users/api-reference#add)",
  version: "0.1.0",
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
    customFields: {
      propDefinition: [
        loops,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      loops, email, firstName, lastName, userGroup, customFields, ...data
    } = this;
    const response = await this.loops.createContact({
      data: {
        email,
        firstName,
        lastName,
        userGroup,
        ...data,
      },
      $,
    });

    $.export("$summary", `Successfully created contact with ID ${response.id}.`);

    return response;
  },
};
