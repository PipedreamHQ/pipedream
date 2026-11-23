import app from "../../tinko.app.mjs";

export default {
  key: "tinko-add-tag-to-contact",
  name: "Add Tag to Contact",
  description: "Add one or more tags to a contact, keeping the tags it already has."
    + " Use **Find Contact** to find the contact ID, **List Tags** to find tag IDs"
    + " and **Create Tag** to add a new tag."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/contacts/#atualizar-contato)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    tagIds: {
      propDefinition: [
        app,
        "tagIds",
      ],
      description: "The tags to add to the contact, e.g. `[\"01JABCDEFGHJKMNPQRSTVWXYZ0\"]`. Use **List Tags** to find tag IDs (the `id` field).",
    },
  },
  async run({ $ }) {
    const { data: contact } = await this.app.getContact({
      $,
      contactId: this.contactId,
    });

    const currentTagIds = (contact.tags ?? []).map((tag) => tag.id);
    const newTagIds = this.tagIds.filter((tagId) => !currentTagIds.includes(tagId));

    if (!newTagIds.length) {
      $.export("$summary", `Contact ${contact.name || contact.phone} already has the selected tags`);
      return contact;
    }

    const response = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data: {
        tags: [
          ...currentTagIds,
          ...newTagIds,
        ],
      },
    });

    $.export("$summary", `Successfully added ${newTagIds.length} tag${newTagIds.length === 1
      ? ""
      : "s"} to contact ${contact.name || contact.phone}`);
    return response.data;
  },
};
