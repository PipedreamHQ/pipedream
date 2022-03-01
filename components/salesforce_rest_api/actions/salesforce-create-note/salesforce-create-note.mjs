// legacy_hash_id: a_Vpi7PO
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-note",
  name: "Create Note",
  description: "Creates a note, which is text associated with a custom object or a standard object, such as a Contact, Contract, or Opportunity.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    ParentId: {
      type: "string",
      description: "ID of the object associated with the note.",
    },
    Title: {
      type: "string",
      description: "Title of the note.",
    },
    Body: {
      type: "string",
      description: "Body of the note. Limited to 32 KB.",
      optional: true,
    },
    IsPrivate: {
      type: "boolean",
      description: "If true, only the note owner or a user with the Modify All Data permission can view the note or query it via the API. Note that if a user who does not have the Modify All Data permission sets this field to true on a note that they do not own, then they can no longer query, delete, or update the note.",
      optional: true,
    },
    OwnerId: {
      type: "string",
      description: "ID of the user who owns the note.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm
  // Note object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_note.htm

    if (!this.ParentId || !this.Title) {
      throw new Error("Must provide ParentId and Title parameters.");
    }

    return await axios($, {
      "method": "post",
      "url": `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/sobjects/Note/`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },
      "data": {
        Body: this.Body,
        IsPrivate: this.IsPrivate,
        OwnerId: this.OwnerId,
        ParentId: this.ParentId,
        Title: this.Title,
      },
    });
  },
};
