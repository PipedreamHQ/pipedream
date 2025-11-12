import clickfunnels from "../../clickfunnels.app.mjs";

export default {
  key: "clickfunnels-apply-tag-contact",
  name: "Apply Tag to Contact",
  description: "Applies a tag to a contact. [See the documentation](https://developers.myclickfunnels.com/reference/createcontactsappliedtags)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
    const response = await this.clickfunnels.applyTagToContact({
      $,
      contactId: this.contactId,
      data: {
        contacts_applied_tag: {
          tag_id: this.tagId,
        },
      },
    });
    $.export("$summary", `Successfully applied tag with Id: ${this.tagId} to contact with Id: ${this.contactId}`);
    return response;
  },
};
