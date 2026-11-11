import asana from "../../asana.app.mjs";

export default {
  props: {
    asana,
    workspace: {
      propDefinition: [
        asana,
        "workspaces",
      ],
      label: "Workspace",
      description: "GID of the workspace, e.g. `1200123456789012`. Use **List Workspaces** to find available workspace GIDs.",
      type: "string",
    },
    project: {
      label: "Project",
      type: "string",
      propDefinition: [
        asana,
        "projects",
      ],
    },
  },
};
