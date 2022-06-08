export default {
  Body: {
    type: "string",
    label: "Body",
    description: "Body of the note. Limited to 32 KB.",
  },
  IsPrivate: {
    type: "boolean",
    label: "Is Private",
    description: "If true, only the note owner or a user with the Modify All Data permission can view the note or query it via the API. Note that if a user who does not have the Modify All Data permission sets this field to true on a note that they do not own, then they can no longer query, delete, or update the note.",
  },
  OwnerId: {
    type: "string",
    label: "Owner ID",
    description: "ID of the user who owns the note.",
  },
};
