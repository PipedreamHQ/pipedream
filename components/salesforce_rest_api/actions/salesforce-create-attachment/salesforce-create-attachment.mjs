import salesforce from "../../salesforce_rest_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-attachment",
  name: "Create Attachment",
  description: "Creates an attachment, which represents a file that a User has uploaded and attached to a parent object.",
  version: "0.3.1",
  type: "action",
  props: {
    salesforce,
    Body: {
      type: "string",
      label: "Body",
      description: "Encoded file data.",
    },
    Name: {
      type: "string",
      label: "Name",
      description: "Name of the attached file. Maximum size is 255 characters.",
    },
    ParentId: {
      type: "string",
      label: "ParentId",
      description: "ID of the parent object of the attachment. The following objects are supported as parents of attachments:\n* Account\n* Asset\n* Campaign\n* Case\n* Contact\n* Contract\n* Custom objects\n* EmailMessage\n* EmailTemplate\n* Event\n* Lead\n* Opportunity\n* Product2\n*  Solution\n* Task",
    },
    ContentType: {
      type: "string",
      label: "ContentType",
      description: "The content type of the attachment.If the Don't allow HTML uploads as attachments or document records security setting is enabled for your organization, you cannot upload files with the following file extensions: .htm, .html, .htt, .htx, .mhtm, .mhtml, .shtm, .shtml, .acgi, .svg. When you insert a document or attachment through the API, make sure that this field is set to the appropriate MIME type.",
      optional: true,
    },
    Description: {
      type: "string",
      label: "Description",
      description: "Description of the attachment. Maximum size is 500 characters. This field is available in API version 18.0 and later.",
      optional: true,
    },
    IsPrivate: {
      type: "boolean",
      label: "IsPrivate",
      description: "Indicates whether this record is viewable only by the owner and administrators (true) or viewable by all otherwise-allowed users (false). During a create or update call, it is possible to mark an Attachment record as private even if you are not the owner. This can result in a situation in which you can no longer access the record that you just inserted or updated. Label is Private.Attachments on tasks or events can't be marked private.",
      optional: true,
    },
    OwnerId: {
      type: "string",
      label: "OwnerId",
      description: "ID of the User who owns the attachment. This field was required previous to release 9.0. Beginning with release 9.0, it can be null on create.The owner of an attachment on a task or event must be the same as the owner of the task or event.",
      optional: true,
    },
  },
  async run({ $ }) {
    //See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm
    // Attachment object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_attachment.htm

    if (!this.Body || !this.Name || !this.ParentId) {
      throw new Error("Must provide Body, Name and ParentId parameters.");
    }

    return await axios($, {
      method: "post",
      url: `${this.salesforce.$auth.instance_url}/services/data/v20.0/sobjects/Attachment/`,
      headers: {
        Authorization: `Bearer ${this.salesforce.$auth.oauth_access_token}`,
      },
      data: {
        Body: this.Body,
        ContentType: this.ContentType,
        Description: this.Description,
        IsPrivate: this.IsPrivate,
        Name: this.Name,
        OwnerId: this.OwnerId,
        ParentId: this.ParentId,
      },
    });
  },
};
