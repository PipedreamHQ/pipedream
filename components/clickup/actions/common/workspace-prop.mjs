import clickup from "../../clickup.app.mjs";

export default {
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
    },
  },
};
