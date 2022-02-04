import clickup from "../clickup.app.mjs";

export default {
  props: {
    clickup,
    workspace: {
      propDefinition: [
        clickup,
        "workspace",
      ],
    },
    space: {
      propDefinition: [
        clickup,
        "space",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    folder: {
      propDefinition: [
        clickup,
        "folder",
        (c) => ({
          space: c.space,
        }),
      ],
    },
    priority: {
      propDefinition: [
        clickup,
        "priority",
      ],
    },
  },
};
