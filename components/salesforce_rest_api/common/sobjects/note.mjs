export default {
  initialProps: {
    Body: {
      type: "string",
      label: "Body",
      description: "Body of the note. Limited to 32 KB.",
    },
    IsPrivate: {
      type: "boolean",
      label: "Private",
      description: "If true, only the note owner or a user with the \"Modify All Data\" permission can view the note or query it via the API.",
      optional: true,
    },
    OwnerId: {
      type: "string",
      label: "Owner ID",
      description: "ID of the user who owns the note (Salesforce's 15- or 18-character record ID, e.g. `005XX000001SvR2`). Use **SOQL Query** to find the User ID.",
      optional: true,
    },
    ParentId: {
      type: "string",
      label: "Parent ID",
      description: "ID of the object associated with the note. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_note.htm) for which objects can be referenced.",
    },
    Title: {
      type: "string",
      label: "Title",
      description: "Title of the note.",
    },
  },
};
