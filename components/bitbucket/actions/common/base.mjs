import bitbucket from "../../bitbucket.app.mjs";

export default {
  props: {
    bitbucket,
    workspaceId: {
      propDefinition: [
        bitbucket,
        "workspace",
      ],
    },
  },
};
