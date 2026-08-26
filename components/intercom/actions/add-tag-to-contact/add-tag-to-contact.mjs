// x-pd-ai: optimized
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-add-tag-to-contact",
  name: "Add Tag To Contact",
  description: "Adds a specific tag to a contact in Intercom. Use **Search Contacts** to find the contact's ID and **List Tag ID Options** to find valid tag IDs before calling this action. Example: set **Contact ID** to `63a07ddf05a32042dffac965` and **Tag ID** to `7522907` to tag that contact. Returns the updated tag object on success. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/contacts/attachtagtocontact).",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intercom,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier for the contact which is given by Intercom. Eg. `63a07ddf05a32042dffac965`.",
      propDefinition: [
        intercom,
        "userIds",
      ],
    },
    tagId: {
      propDefinition: [
        intercom,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const {
      contactId,
      tagId,
    } = this;

    const response = await this.intercom.addTagToContact({
      $,
      contactId,
      data: {
        id: tagId,
      },
    });

    $.export("$summary", `Successfully added tag to contact with ID \`${response.id}\`.`);
    return response;
  },
};
