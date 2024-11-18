import common from "../common/common-create-update.mjs";

export default {
  ...common,
  key: "loops_so-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the Documentation](https://loops.so/docs/add-users/api-reference#add)",
  version: "0.2.0",
  type: "action",
  async run({ $ }) {
    const response = await this.loops.createContact({
      data: this.prepareData(),
      $,
    });

    $.export("$summary", `Successfully created contact with ID ${response.id}.`);

    return response;
  },
};
