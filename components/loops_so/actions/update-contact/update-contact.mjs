import loops from "../../loops_so.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "loops_so-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact by email. If email not found, a new contact will be created. [See the Documentation](https://loops.so/docs/add-users/api-reference#update)",
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
    const response = await this.loops.updateContact({
      data: pickBy({
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        userGroup: this.userGroup,
      }),
      $,
    });

    $.export("$summary", `Successfully updated contact with ID ${response.id}.`);

    return response;
  },
};
