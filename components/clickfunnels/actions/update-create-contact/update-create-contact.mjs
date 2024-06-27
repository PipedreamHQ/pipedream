import clickfunnels from "../../clickfunnels.app.mjs";
import {
  clearObj, parseObject,
} from "../../common/utils.mjs";

export default {
  key: "clickfunnels-update-create-contact",
  name: "Update or Create Contact",
  description: "Searches for a contact by email and updates it, or creates a new one if not found. [See the documentation](https://developers.myclickfunnels.com/reference/upsertcontact)",
  version: "0.0.1",
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
    email: {
      propDefinition: [
        clickfunnels,
        "email",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The contact's phone number.",
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The contact's time zone.",
      optional: true,
    },
    fbUrl: {
      type: "string",
      label: "FB URL",
      description: "The contact's Facebook URL.",
      optional: true,
    },
    twitterUrl: {
      type: "string",
      label: "Twitter URL",
      description: "The contact's twitter URL.",
      optional: true,
    },
    instagramUrl: {
      type: "string",
      label: "Instagram URL",
      description: "The contact's instagram URL.",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "Linkedin URL",
      description: "The contact's linkedin URL.",
      optional: true,
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "The contact's website URL.",
      optional: true,
    },
    tagIds: {
      propDefinition: [
        clickfunnels,
        "tagId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
      optional: true,
      type: "string[]",
      label: "Tag Ids",
      description: "An empty array is ignored here. If you wish to remove all tags for a Contact, use the Update Contact endpoint. A non-empty array overwrites the existing array.",
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: `Custom attributes are usually added in ClickFunnels to a contact when they submit forms that contain custom contact attributes. Here you can directly create them during contact modification.
        Custom attributes are provided as key-value pairs:
        A key that does not exist, will create a new custom contact attribute.
        A key that already exists, will update the value of an existing custom contact attribute.
        Empty or null values, will set the custom attribute values to empty strings. A key that has special characters or spaces will be automatically converted to snake_case (For example, 'Favorite Food! 🥑' will be converted to 'favorite_food').
        Empty keys will trigger a bad request response. Also, non-object inputs for custom_attributes(e.g. an array or string), it will be ignored.
        Keys that are default properties on the Contact resource or variations of it will result in an error. E.g., 'first_name', 'First Name', etc. are not valid inputs.
        `,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      data, status,
    } = await this.clickfunnels.upsertContact({
      $,
      returnFullResponse: true,
      workspaceId: this.workspaceId,
      data: {
        contact: clearObj({
          email_address: this.email,
          first_name: this.firstName,
          last_name: this.lastName,
          phone_number: this.phoneNumber,
          time_zone: this.timeZone,
          fb_url: this.fbUrl,
          twitter_url: this.twitterUrl,
          instagram_url: this.instagramUrl,
          linkedin_url: this.linkedinUrl,
          website_url: this.websiteUrl,
          tag_ids: parseObject(this.tagIds),
          custom_attributes: parseObject(this.customAttributes),
        }),
      },
    });

    $.export("$summary", `Contact with Id: ${data.id} has been ${status === 200
      ? "updated"
      : "created"} successfully.`);
    return data;
  },

};
