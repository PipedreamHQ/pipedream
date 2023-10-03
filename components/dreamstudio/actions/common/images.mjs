import dreamstudio from "../../dreamstudio.app.mjs";

export default {
  props: {
    dreamstudio,
    organizationId: {
      propDefinition: [
        dreamstudio,
        "organizationId",
      ],
    },
    engineId: {
      propDefinition: [
        dreamstudio,
        "engineId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
  },
};
