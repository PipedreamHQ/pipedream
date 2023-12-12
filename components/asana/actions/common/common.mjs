import asana from "../../asana.app.mjs";

export default {
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "Gid of a workspace.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
      optional: true,
    },
    project: {
      label: "Project",
      type: "string",
      propDefinition: [
        asana,
        "projects",
      ],
      optional: true,
    },
  },
};
