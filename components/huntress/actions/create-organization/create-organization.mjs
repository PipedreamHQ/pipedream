import app from "../../huntress.app.mjs";

export default {
  key: "huntress-create-organization",
  name: "Create Organization",
  description: "Create a new organization in your Huntress account. [See the documentation](https://api.huntress.io/docs#tag/organizations/post/v1/organizations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the organization. Value cannot be blank and must be 256 characters or less.",
    },
    key: {
      type: "string",
      label: "Key",
      description: "Organization key used to associate a Huntress Agent into a grouping. Value cannot be blank and must be 256 characters or less.",
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrganization({
      $,
      data: {
        name: this.name,
        key: this.key,
      },
    });

    $.export("$summary", `Successfully created organization \`${response?.organization?.id ?? response?.id ?? this.name}\``);

    return response;
  },
};
