import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "linear_app-new-issue-status-updated",
  name: "New Issue Status Updated (Instant)",
  description: "Emit new event when the status of an issue is updated. [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.1.9",
  dedupe: "unique",
  props: {
    linearApp: common.props.linearApp,
    db: "$.service.db",
    teamId: {
      label: "Team ID",
      type: "string",
      propDefinition: [
        common.props.linearApp,
        "teamId",
      ],
      reloadProps: true,
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
    _getPreviousStatuses() {
      return this.db.get("previousStatuses") || {};
    },
    _setPreviousStatuses(previousStatuses) {
      this.db.set("previousStatuses", previousStatuses);
    },
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
    getResource(issue) {
      return this.linearApp.getIssue({
        issueId: issue.id,
      });
    },
    getMetadata(resource) {
      const {
        delivery,
        title,
        data,
        updatedAt,
      } = resource;
      const ts = Date.parse(updatedAt);
      return {
        id: delivery || `${resource.id}-${ts}`,
        summary: `Issue status updated: ${data?.title || title}`,
        ts,
      };
    },
    async emitPolledResources() {
      const previousStatuses = this._getPreviousStatuses();
      const newStatuses = {};

      const stream = this.linearApp.paginateResources({
        resourcesFn: this.getResourcesFn(),
        resourcesFnArgs: this.getResourcesFnArgs(),
        useGraphQl: this.useGraphQl(),
        max: 1000,
      });
      const resources = await utils.streamIterator(stream);

      const updatedResources = [];
      for (const issue of resources) {
        newStatuses[issue.id] = issue.state.id;
        if (issue.createdAt === issue.updatedAt) {
          continue;
        }
        if (previousStatuses[issue.id] !== issue.state.id) {
          updatedResources.push(issue);
        }
      }

      this._setPreviousStatuses(newStatuses);

      updatedResources
        .reverse()
        .forEach((resource) => {
          this.$emit(resource, this.getMetadata(resource));
        });
    },
  },
};
