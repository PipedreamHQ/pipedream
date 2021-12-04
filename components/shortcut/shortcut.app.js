const { ShortcutClient } = require("@useshortcut/client");
const get = require("lodash/get");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "shortcut",
  methods: {
    api() {
      return new ShortcutClient(this.$auth.api_key);
    },
    _isRetriableStatusCode(statusCode) {
      [
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
          const statusCode = [
            get(err, [
              "response",
              "status",
            ]),
          ];
          if (!this._isRetriableStatusCode(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err.message)}
            `);
          }
          console.warn(`Temporary error: ${err.message}`);
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
     * Returns a validation message
     *
     * @param {object} validationResults a validation results object from validate.js library
     * @returns it will generate validation message for each of the validation results present in
     * `validationResults`.
     */
    checkValidationResults(validationResults) {
      if (validationResults) {
        const validationErrorMsg = Object.keys(validationResults)
          .map((key) => `\t${validationResults[key]}`)
          .join("\n");
        const errorMsg = `Parameter validation failed with the following errors:\n${validationErrorMsg}`;
        throw new Error(errorMsg);
      }
    },
    /**
     * Returns `undefined` when `value` is an empty string or `null`.
     *
     * @param {object} value the value to check for returning `null`.
     * @returns If `value` is defined, it will return `value`. Otherwise on an empty string, or
     * `null` it will return `undefined`.
     */
    convertEmptyStringToUndefined(value) {
      return value || undefined;
    },
    /**
     * Creates a new story in your Shortcut account.
     * @params {boolean} archived - Controls the story’s archived state.
     * @params {array} comments - Array with comments to add to the story. Each comment must have
     * [CreateStoryCommentParams](https://shortcut.com/api/rest/v3#CreateStoryCommentParams)
     * structure.
     * @params {Date} completedAtOverride - A manual override for the time/date the Story was
     * completed.
     * @params {Date} createdAt - The time/date the Story was created.
     * @params {Date} dueDate - The due date of the story.
     * @params {string} description - The description of the story.
     * @params {integer} epicId - The unique identifier of the epic the story belongs to.
     * @params {integer} estimate - The numeric point estimate of the story. Can be null, which
     * means unestimated.
     * @params {string} externalId - This field can be set to another unique ID. In the case that
     *  the Story has been imported from another tool, the ID in the other tool can be indicated
     * here.
     * @params {array} externalLinks - An array of External Links associated with this story.
     * @params {array} fileIds - An array of IDs of files attached to the story.
     * @params {array} followerIds - An array of UUIDs of the followers of this story.
     * @params {string} groupId - The id of the group to associate with this story.
     * @params {integer} iterationId - The ID of the iteration the story belongs to.
     * @params {array} labels - An array of labels attached to the story. Each label must have the
     * [CreateLabelParams](https://shortcut.com/api/rest/v3#CreateLabelParams) structure.
     * @params {array} linkedFileIds - An array of integers with the IDs of linked files attached
     * to the story.
     * @params {string} name - The name of the story.
     * @params {array} ownerIds - An array of UUIDs of the owners of this story.
     * @params {integer} projectId - The ID of the project the story belongs to.
     * @params {integer} requestedById - The ID of the member that requested the story.
     * @params {Date} startedAtOverride - Manual override for the time/date the Story was started.
     * @params {array} storyLinks - An array of story links attached to the story. Each story link
     * must have the
     * [CreateStoryLinkParams](https://shortcut.com/api/rest/v3#CreateStoryLinkParams) structure.
     * @params {string} storyType - The type of story (feature, bug, chore).
     * @params {array} tasks - An array of tasks connected to the story. Each task must have the
     * [CreateTaskParams](https://shortcut.com/api/rest/v3#CreateTaskParams) structure.
     * @params {string} updatedAt - The time/date the story was updated.
     * @params {integer} workflowStateId - The ID of the workflow state the story will be in.
     * @returns {story: object } An object with the created story, as per input provided, default
     * values. See the full schema at
     * [Create Story Responses](https://shortcut.com/api/rest/v3#Responses-79271).
     */
    async createStory(data) {
      return await this.api().createStory(data);
    },
    /**
     * Returns a list of all Epics and their attributes.
     * @returns {epics: array } An array of all epics in the connected Shortcut account.
     * See the [Epic schema](https://shortcut.com/api/rest/v3#Epic) at the API docs.
     */
    async listEpics() {
      return await this.api().listEpics();
    },
    /**
     * Returns a list of all Files.
     * @returns {files: array } An array of all files in the connected Shortcut
     * account.
     * See the [Files schema](https://shortcut.com/api/rest/v3#List-Files) at the API docs.
     */
    async listFiles() {
      return await this.api().listFiles();
    },
    /**
     * Returns a list of all Linked Files.
     * @returns {linkedFiles: array } An array of all linked files in the connected shortcut
     * account.
     * See the [Linked File schema](https://shortcut.com/api/rest/v3#LinkedFile) at the API docs.
     */
    async listLinkedFiles() {
      return await this.api().listLinkedFiles();
    },
    /**
     * Returns a list of all Members and their attributes.
     * @returns {members: array } An array of all members in the connected Shortcut account.
     * See the [Members schema](https://shortcut.com/api/rest/v3#Member) at the API docs.
     */
    async listMembers() {
      return await this.api().listMembers();
    },
    /**
     * Returns a list of all Members as options to use as dynamically populated prop's options.
     * @returns {members: array } An array where each element has the `value` and `label`
     * properties, to be used as dynamically populated prop's options. `value` is set to the `id`
     * of the shortcut member, and `label` to the member's name.
     */
    async listMembersAsOptions() {
      const members = await this.callWithRetry("listMembers");
      const options = [];
      members.forEach((member) => {
        options.push({
          label: member.profile.name,
          value: member.id,
        });
      });
      return options;
    },
    /**
     * Returns a list of all projects.
     * @returns {members: array } An array of all projects in the connected Shortcut account.
     * See the [Projects schema](https://shortcut.com/api/rest/v3#Project) at the API docs.
     */
    async listProjects() {
      return await this.api().listProjects();
    },
    /**
     * Returns a list of all Workflows and their attributes.
     * @returns {workflows: array } An array of all Workflows in the connected Shortcut account.
     * See the [Workflow schema](https://shortcut.com/api/rest/v3#Workflow) at the API docs.
     */
    async listWorkflows() {
      return await this.api().listWorkflows();
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
      const page_size = Math.min(numberOfStories, 2);
      let next = undefined;
      do {
        const results = await this._withRetries(() =>
          this.api().searchStories({
            query,
            page_size,
            next,
          }));
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
