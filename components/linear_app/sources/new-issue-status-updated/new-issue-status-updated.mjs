import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-new-issue-status-updated",
  name: "New Issue Status Updated (Instant)",
  description: "Emit new event when the status of an issue is updated. See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.1.4",
  dedupe: "unique",
  props: {
    linearApp: common.props.linearApp,
    http: common.props.http,
    db: common.props.db,
    teamId: {
      label: "Team ID",
      type: "string",
      propDefinition: [
        common.props.linearApp,
        "teamId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        common.props.linearApp,
        "projectId",
      ],
    },
    stateId: {
      propDefinition: [
        common.props.linearApp,
        "stateId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
      description: "Emit issues that are updated to this state",
    },
  },
  methods: {
    ...common.methods,
    getResourceTypes() {
      return [
        constants.RESOURCE_TYPE.ISSUE,
      ];
    },
    getWebhookLabel() {
      return "Issue status updated";
    },
    getResourcesFn() {
      return this.linearApp.listIssues;
    },
    getResourcesFnArgs() {
      return {
        sortBy: "updatedAt",
        filter: {
          team: this.teamId && {
            id: {
              in: [
                this.teamId,
              ],
            },
          },
          project: {
            id: {
              eq: this.projectId,
            },
          },
          state: {
            id: {
              eq: this.stateId,
            },
          },
        },
      };
    },
    isRelevant(body) {
      return body?.updatedFrom?.stateId && (!this.stateId || body.data.stateId === this.stateId);
    },
    getMetadata(resource) {
      const {
        delivery,
        title,
        data,
        updatedAt,
      } = resource;
      return {
        id: delivery || resource.id,
        summary: `Issue status updated: ${data?.title || title}`,
        ts: Date.parse(updatedAt),
      };
    },
  },
};
