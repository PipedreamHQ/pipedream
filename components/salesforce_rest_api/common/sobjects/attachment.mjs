import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  createProps: {
    Name: {
      type: "string",
      label: "File Name",
      description: "Name of the attached file. Max 255 characters.",
    },
    filePathOrContent: {
      type: "string",
      label: "File Path or Content",
      description: "The path to a file in the `tmp` folder [(see the documentation)](https://pipedream.com/docs/code/nodejs/working-with-files). Alternatively, you can provide the base64-encoded file data.",
    },
    ContentType: {
      type: "string",
      label: "Content Type",
      description: "The content type (MIME type) of the attachment. For example, `image/png`.",
    },
    ParentId: {
      type: "string",
      label: "Parent ID",
      description: "ID of the parent object of the attachment. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_attachment.htm) for supported objects.",
    },
  },
  updateProps: {
    IsPartnerShared: {
      type: "boolean",
      label: "Is Shared With Partner",
      description: "Whether this record is shared with a connection using Salesforce to Salesforce.",
      optional: true,
    },
  },
  initialProps: {
    Description: {
      type: "string",
      label: "Description",
      description: "Description of the attachment. Max 500 characters.",
      optional: true,
    },
    IsPrivate: {
      type: "boolean",
      label: "Private",
      description: "Whether this record is viewable only by the owner and administrators (true) or viewable by all otherwise-allowed users (false).",
      optional: true,
    },
    OwnerId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "User",
          nameField: "Name",
        }),
      ],
      label: "Owner ID",
      description: "ID of the user who owns the attachment.",
      optional: true,
    },
  },
};
