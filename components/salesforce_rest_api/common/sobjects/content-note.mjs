export default {
  initialProps: {
    OwnerId: {
      type: "string",
      label: "Owner ID",
      description: "ID of the user who owns the note. Use **SOQL Query** to find the User ID.",
      optional: true,
    },
    Title: {
      type: "string",
      label: "Title",
      description: "Title of the note.",
    },
    Content: {
      type: "string",
      label: "Content",
      description: "The content or body of the note, which can include properly formatted HTML or plain text.",
    },
    IsReadOnly: {
      type: "boolean",
      label: "Read Only",
      description: "Indicates whether the note is read only.",
      optional: true,
    },
  },
};
