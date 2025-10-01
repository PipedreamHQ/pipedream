import common from "../common/common-create-update.mjs";

export default {
  ...common,
  key: "loops_so-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact by email. If email not found, a new contact will be created. [See the Documentation](https://loops.so/docs/add-users/api-reference#update)",
  version: "0.2.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const response = await this.loops.updateContact({
      data: this.prepareData(),
      $,
    });

    $.export("$summary", `Successfully updated contact with ID ${response.id}.`);

    return response;
  },
};
