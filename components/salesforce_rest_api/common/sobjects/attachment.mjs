export default {
  ContentType: {
    type: "string",
    label: "Content Type",
    description: "The content type of the attachment. If the Don't allow HTML uploads as attachments or document records security setting is enabled for your organization, you cannot upload files with the following file extensions: .htm, .html, .htt, .htx, .mhtm, .mhtml, .shtm, .shtml, .acgi, .svg. When you insert a document or attachment through the API, make sure that this field is set to the appropriate MIME type.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "Description of the attachment. Maximum size is 500 characters. This field is available in API version 18.0 and later.",
  },
  IsPrivate: {
    type: "boolean",
    label: "Is Private?",
    description: "Indicates whether this record is viewable only by the owner and administrators (true) or viewable by all otherwise-allowed users (false). During a create or update call, it is possible to mark an Attachment record as private even if you are not the owner. This can result in a situation in which you can no longer access the record that you just inserted or updated. Label is Private.Attachments on tasks or events can't be marked private.",
  },
  OwnerId: {
    type: "string",
    label: "Owner ID",
    description: "ID of the User who owns the attachment. This field was required previous to release 9.0. Beginning with release 9.0, it can be null on create. The owner of an attachment on a task or event must be the same as the owner of the task or event.",
  },
};
