import salesforce from "../../salesforce_rest_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-casecomment",
  name: "Create CaseComment",
  description: "Creates a CaseComment that provides additional information about the associated Case.",
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    ParentId: {
      type: "string",
      label: "ParentId",
      description: "Required. ID of the parent Case of the CaseComment.",
    },
    CommentBody: {
      type: "string",
      label: "CommentBody",
      description: "Text of the CaseComment. The maximum size of the comment body is 4,000 bytes. Label is Body.",
      optional: true,
    },
    IsNotificationSelected: {
      type: "boolean",
      label: "IsNotificationSelected",
      description: "Indicates whether an email notification is sent to the case contact when a CaseComment is created or updated. When this field is queried, it always returns null. This field is available only when the Enable Case Comment Notification to Contacts setting is enabled on the Support Settings page in Setup. To send email notifications for CaseComment, you must use the EmailHeader triggerUserEmail. Available in API version 43.0 and later.",
      optional: true,
    },
    IsPublished: {
      type: "boolean",
      label: "IsPublished",
      description: "Indicates whether the CaseComment is visible to customers in the Self-Service portal (true) or not (false). Label is Published. This is the only CaseComment field that can be updated via the API.",
      optional: true,
    },
  },
  async run({ $ }) {
    // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm
    // CaseComment object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_casecomment.htm

    if (!this.ParentId) {
      throw new Error("Must provide ParentId parameter.");
    }

    return await axios($, {
      "method": "post",
      "url": `${this.salesforce.$auth.instance_url}/services/data/v20.0/sobjects/CaseComment/`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce.$auth.oauth_access_token}`,
      },
      "data": {
        CommentBody: this.CommentBody,
        IsNotificationSelected: this.IsNotificationSelected,
        IsPublished: this.IsPublished,
        ParentId: this.ParentId,
      },
    });
  },
};
