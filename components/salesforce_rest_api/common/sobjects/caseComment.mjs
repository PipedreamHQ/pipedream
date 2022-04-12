export default {
  CommentBody: {
    type: "string",
    label: "CommentBody",
    description: "Text of the CaseComment. The maximum size of the comment body is 4,000 bytes. Label is Body.",
  },
  IsNotificationSelected: {
    type: "boolean",
    label: "IsNotificationSelected",
    description: "Indicates whether an email notification is sent to the case contact when a CaseComment is created or updated. When this field is queried, it always returns null. This field is available only when the Enable Case Comment Notification to Contacts setting is enabled on the Support Settings page in Setup. To send email notifications for CaseComment, you must use the EmailHeader triggerUserEmail. Available in API version 43.0 and later.",
  },
  IsPublished: {
    type: "boolean",
    label: "IsPublished",
    description: "Indicates whether the CaseComment is visible to customers in the Self-Service portal (true) or not (false). Label is Published. This is the only CaseComment field that can be updated via the API.",
  },
};
