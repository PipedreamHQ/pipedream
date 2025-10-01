import checkvist from "../../checkvist.app.mjs";

export default {
  key: "checkvist-create-new-list",
  name: "Create New List",
  description: "Creates a new list in Checkvist. [See the documentation](https://checkvist.com/auth/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    checkvist,
    name: {
      type: "string",
      label: "List Name",
      description: "Name of the new list to be created",
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "true for checklist which can be accessed in read-only mode by anyone. Access to such checklists doesn't require authentication.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.checkvist.createList({
      $,
      data: {
        name: this.name,
        public: this.public,
      },
    });

    $.export("$summary", `Successfully created a new list: ${this.name}`);
    return response;
  },
};
