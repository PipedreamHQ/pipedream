import common from "../common/common-create-update.mjs";
import pickBy from "lodash.pickby";

export default {
  ...common,
  key: "loops_so-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact by email. If email not found, a new contact will be created. [See the Documentation](https://loops.so/docs/add-users/api-reference#update)",
  version: "0.1.0",
  type: "action",
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      loops, email, firstName, lastName, userGroup, customFields, ...data
    } = this;
    const response = await this.loops.updateContact({
      data: pickBy({
        email,
        firstName,
        lastName,
        userGroup,
        ...data,
      }),
      $,
    });

    $.export("$summary", `Successfully updated contact with ID ${response.id}.`);

    return response;
  },
};
