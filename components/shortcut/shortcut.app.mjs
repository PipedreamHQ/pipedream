import { ShortcutClient } from "@shortcut/client";
import lodash from "lodash";
import retry from "async-retry";

export default {
  type: "app",
  app: "shortcut",
  propDefinitions: {
    workflowStateId: {
      type: "integer",
      label: "Workflow State ID",
      description: "The ID of the workflow state the story will be in",
      async options() {
        let options = [];
        const workflows = await this.callWithRetry("listWorkflows");
        const isWorkflowDataAvailable = lodash.get(workflows, [
          "data",
          "length",
        ]);
        if (!isWorkflowDataAvailable) {
          return options;
        }
        return workflows.data.reduce(function (options, workflow) {
          const hasState = lodash.get(workflow, [
            "states",
            "length",
          ]);
          if (!hasState) {
            return options;
          }
          const optionsToAdd = workflow.states.map((state) => ({
            label: `${state.name} (${workflow.name})`,
            value: state.id,
          }));
          return options.concat(optionsToAdd);
        }, []);
      },
    },
    labelIds: {
      type: "integer[]",
      label: "Label IDs",
      description: "The IDs of the labels to filter events by",
      optional: true,
      async options() {
        const { data = [] } = await this.callWithRetry("listLabels");
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    storyIds: {
      type: "integer[]",
      label: "Story IDs",
      description: "The IDs of stories to link as related to the new story",
      optional: true,
      async options({ prevContext }) {
        const { data = [] } = await this.callWithRetry("searchStories", {
          query: "is:story",
          page_size: 25,
          next: prevContext?.next,
        });
        return {
          options: data.data?.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next: data.next || undefined,
          },
        };
      },
    },
  },
  methods: {
    api() {
      return new ShortcutClient(this.$auth.api_key);
    },
    _isRetriableStatusCode(statusCode) {
      return [
        408,
        429,
        500,
      ].includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 3,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = lodash.get(err, [
            "response",
            "status",
          ]);
          if (!this._isRetriableStatusCode(statusCode)) {
            if (err.response?.data) {
              bail(JSON.stringify({
                statusCode,
                data: err.response?.data,
              }, null, 2));
            } else {
              bail(`Unexpected error (status code: ${statusCode}): ${JSON.stringify(err.message)}`);
            }
          }
          throw err;
        }
      }, retryOpts);
    },
    callWithRetry(method, ...args) {
      return this._withRetries(
        () => this.api()[method](...args),
      );
    },
    /**
     * Returns a list of all Members as options to use as dynamically populated prop's options.
     * @returns {members: array } An array where each element has the `value` and `label`
     * properties, to be used as dynamically populated prop's options. `value` is set to the `id`
     * of the shortcut member, and `label` to the member's name.
     */
    async listMembersAsOptions() {
      let options = [];
      const members = await this.callWithRetry("listMembers");
      const isMembersDataAvailable = lodash.get(members, [
        "data",
        "length",
      ]);
      if (!isMembersDataAvailable) {
        return options;
      }
      options = members.data.map((member) => ({
        label: member.profile.name,
        value: member.id,
      }));
      return options;
    },
    /**
     * Searches for stories in your Shortcut account.
     * @params {string} query - The search query based on the
     * [Search page](https://help.shortcut.com/hc/en-us/articles/115005967026)
     * [search operators]
     * (https://help.shortcut.com/hc/en-us/articles/360000046646-Search-Operators)
     * to use for finding stories.
     * @params {integer} numberOfStories - The number of stories to return.
     * @returns {stories: array } An array stories matching the `query` parameter. Number of
     *  results are limited by `numberOfStories`.
     */
    async searchStories(query, numberOfStories) {
      let stories = [];
      // eslint-disable-next-line camelcase
      const pageSize = Math.min(numberOfStories, 25);
      let next = undefined;
      do {
        const results = await this._withRetries(() =>
          this.api().searchStories({
            query,
            page_size: pageSize,
            next,
          }));
        const isStoryDataAvailable = lodash.get(results, [
          "data",
          "data",
          "length",
        ]);
        if (!isStoryDataAvailable) {
          break;
        }
        stories.push(...results.data.data);
        const decodedNext = decodeURIComponent(results.data.next);
        const idxQuestionMark = decodedNext.indexOf("?");
        const nextQueryString = decodedNext.substring(idxQuestionMark + 1);
        let searchParams = new URLSearchParams(nextQueryString);
        next = searchParams.get("next");
      } while (stories.length < numberOfStories && next);
      return stories.slice(0, numberOfStories);
    },
  },
};
