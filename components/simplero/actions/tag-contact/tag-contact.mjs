import app from "../../simplero.app.mjs";

export default {
  type: "action",
  key: "simplero-tag-contact",
  name: "Tag Contact",
  description: "Add a tag to a contact. [See the documentation](https://github.com/Simplero/Simplero-API?tab=readme-ov-file#add-tag-to-contact)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "The email address of the contact to tag",
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "The tag name to add to the contact",
    },
  },
  async run({ $ }) {
    const response = await this.app.addTagToContact({
      $,
      data: {
        email: this.email,
        tag: this.tag,
      },
    });

    $.export("$summary", `Successfully added tag "${this.tag}" to contact ${this.email}`);

    return response;
  },
};

