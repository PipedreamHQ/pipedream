import clickfunnels from "../../clickfunnels.app.mjs";

export default {
  key: "clickfunnels-remove-tag-contact",
  name: "Remove Tag from Contact",
  description: "Removes a specified tag from a contact. This action will take no effect if the specified tag doesn't exist on the contact. [See the documentation](https://developers.myclickfunnels.com/reference/removecontactsappliedtags)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    clickfunnels,
    teamId: {
      propDefinition: [
        clickfunnels,
        "teamId",
      ],
    },
    workspaceId: {
      propDefinition: [
        clickfunnels,
        "workspaceId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
    contactId: {
      propDefinition: [
        clickfunnels,
        "contactId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    tagId: {
      propDefinition: [
        clickfunnels,
        "tagId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { tags } = await this.clickfunnels.getContact({
      contactId: this.contactId,
    });

    const filteredTags = tags.filter((tag) => tag.id != this.tagId).map((tag) => tag.id);
    const response = await this.clickfunnels.updateContact({
      contactId: this.contactId,
      data: {
        contact: {
          tag_ids: filteredTags,
        },
      },
    });

    $.export("$summary", `Successfully removed tag ${this.tagId} from contact ${this.contactId}`);
    return response;
  },
};
