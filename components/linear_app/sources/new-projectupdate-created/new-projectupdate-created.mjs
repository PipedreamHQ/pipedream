import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";
import linearApp from "../../linear_app.app.mjs";

export default {
  ...common,
  key: "linear_app-new-projectupdate-created",
  name: "New Project Update Written (Instant)",
  description: "Triggers instantly when a project update (status report) is created in Linear. Returns update content, author, project details, and health status. Filters by team and optionally by project. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  type: "source",
  version: "0.0.8",
  dedupe: "unique",
  props: {
    linearApp,
    db: "$.service.db",
    teamId: {
      label: "Team ID",
      type: "string",
      propDefinition: [
        common.props.linearApp,
        "teamId",
      ],
      description: "The identifier or key of the team associated with the project",
      reloadProps: true,
    },
    projectId: {
      propDefinition: [
        common.props.linearApp,
        "projectId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
      description: "Filter results by project",
    },
  },
  methods: {
    ...common.methods,
    getResourceTypes() {
      return [
        constants.RESOURCE_TYPE.PROJECT_UPDATE,
      ];
    },
    getWebhookLabel() {
      return "Project Update created";
    },
    getResourcesFn() {
      return this.linearApp.listProjectUpdates;
    },
    getResourcesFnArgs() {
      return {
        orderBy: "createdAt",
        filter: {
          createdAt: {
            gte: "-P1W", //  within the last week
          },
        },
      };
    },
    getResource(projectUpdate) {
      return this.linearApp.getProjectUpdateGraphQL(projectUpdate.id);
    },
    isRelevant(body) {
      return body?.action === "create";
    },
    isRelevantPolling(resource) {
      const teamIds = resource.infoSnapshot.teamsInfo.map(({ id }) => id);
      const projectId = resource.project.id;
      return (teamIds.includes(this.teamId)) && (!this.projectId || projectId === this.projectId);
    },
    getMetadata(resource) {
      const {
        data,
        createdAt,
      } = resource;
      const ts = Date.parse(data?.createdAt || createdAt);
      const id = data?.id || resource.id;
      return {
        id,
        summary: `New Project Update: ${id}`,
        ts,
      };
    },
  },
};
