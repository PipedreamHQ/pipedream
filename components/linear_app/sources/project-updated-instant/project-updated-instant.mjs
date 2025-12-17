import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";
import linearApp from "../../linear_app.app.mjs";

export default {
  ...common,
  key: "linear_app-project-updated-instant",
  name: "Project Updated (Instant)",
  description: "Triggers instantly when a project is updated in Linear. Returns project details including name, description, status, dates, and team info. Supports filtering by specific teams. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  type: "source",
  version: "0.0.9",
  dedupe: "unique",
  props: {
    linearApp,
    teamIds: {
      label: "Team IDs",
      type: "string[]",
      propDefinition: [
        linearApp,
        "teamId",
      ],
      description: "The identifier or key of the team associated with the project",
      reloadProps: true,
    },
    db: "$.service.db",
  },
  methods: {
    ...common.methods,
    getResourceTypes() {
      return [
        constants.RESOURCE_TYPE.PROJECT,
      ];
    },
    getWebhookLabel() {
      return "Project updated";
    },
    getResourcesFn() {
      return this.linearApp.listProjects;
    },
    getResourcesFnArgs() {
      return {
        orderBy: "updatedAt",
        filter: {
          accessibleTeams: {
            id: {
              in: this.teamIds,
            },
          },
        },
      };
    },
    getResource(project) {
      return this.linearApp.getProject(project.id);
    },
    getMetadata(resource) {
      const {
        name,
        data,
        updatedAt,
      } = resource;
      const ts = Date.parse(data?.updatedAt || updatedAt);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Project Updated: ${data?.name || name}`,
        ts,
      };
    },
  },
};
