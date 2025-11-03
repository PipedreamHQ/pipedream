import app from "../../orbit.app.mjs";

export default {
  name: "Create Member Note",
  description: "Create a new member note. [See the docs here](https://api.orbit.love/reference/post_workspace-slug-members-member-slug-notes)",
  key: "orbit-create-member-note",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    workspaceSlug: {
      propDefinition: [
        app,
        "workspaceSlug",
      ],
    },
    workspaceMemberSlug: {
      propDefinition: [
        app,
        "workspaceMemberSlug",
        ({ workspaceSlug }) => ({
          workspaceSlug,
        }),
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "The note to add to the member.",
    },
  },
  async run({ $ }) {
    const note = {
      body: this.note,
    };
    const res = await this.app.createNote(
      this.workspaceSlug,
      this.workspaceMemberSlug,
      note,
    );
    $.export("$summary", `Note successfully created with id "${res.data.id}"`);
    return res;
  },
};
