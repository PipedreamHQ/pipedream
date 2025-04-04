import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";
import linearApp from "../../linear_app.app.mjs";

export default {
  ...common,
  key: "linear_app-project-updated-instant",
  name: "New Updated Project (Instant)",
  description: "Emit new event when a project is updated. [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.0.3",
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
