import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";
import linearApp from "../../linear_app.app.mjs";

export default {
  ...common,
  key: "linear_app-new-projectupdate-created",
  name: "New Project Update Written (Instant)",
  description: "Project updates are short status reports on the health of your projects. Emit new event when a new Project Update is written. [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.0.2",
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
      return this.linearApp.getProjectUpdate(projectUpdate.id);
    },
    isRelevant(body) {
      const teamIds = body.data.infoSnapshot.teamsInfo.map(({ id }) => id);
      return body?.action === "create" && teamIds.includes(this.teamId);
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
