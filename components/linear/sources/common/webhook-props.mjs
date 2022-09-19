import linearApp from "../../linear.app.mjs";

export default {
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
};
