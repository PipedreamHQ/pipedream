const clubhouse = require("clubhouse-lib");
const get = require("lodash/get");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "clubhouse",
  methods: {
    api() {
      return clubhouse.create(this.$auth.api_key);
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
     * Creates a new story in your clubhouse.
     * @params {boolean} archived - Controls the story’s archived state.
     * @params {array} comments - Array with comments to add to the story. Each comment must have
     * [CreateStoryCommentParams](https://clubhouse.io/api/rest/v3/#CreateStoryCommentParams)
     * structure.
     * @params {Date} completedAtOverride - A manual override for the time/date the Story was
     * completed.
     * @params {Date} createdAt - The time/date the Story was created.
     * @params {Date} dueDate - The due date of the story.
     * @params {string} description - The description of the story.
     * @params {integer} epicId - The unique identifier of the epic the story belongs to.
     * @params {integer} estimate - The numeric point estimate of the story. Can be null, which
     * means unestimated.
     * @params {integer} externalId - This field can be set to another unique ID. In the case that
     *  the Story has been imported from another tool, the ID in the other tool can be indicated
     * here.
     * @params {array} externalLinks - An array of External Links associated with this story.
     * @params {array} fileIds - An array of IDs of files attached to the story.
     * @params {array} followerIds - An array of UUIDs of the followers of this story.
     * @params {string} groupId - The id of the group to associate with this story.
     * @params {integer} iterationId - The ID of the iteration the story belongs to.
     * @params {array} labels - An array of labels attached to the story. Each label must have the
     * [CreateLabelParams](https://clubhouse.io/api/rest/v3/#CreateLabelParams) structure.
     * @params {array} linkedFileIds - An array of integers with the IDs of linked files attached
     * to the story.
     * @params {string} name - The name of the story.
     * @params {array} ownerIds - An array of UUIDs of the owners of this story.
     * @params {integer} projectId - The ID of the project the story belongs to.
     * @params {integer} requestedById - The ID of the member that requested the story.
     * @params {Date} startedAtOverride - Manual override for the time/date the Story was started.
     * @params {array} storyLinks - An array of story links attached to the story. Each story link
     * must have the
     * [CreateStoryLinkParams](https://clubhouse.io/api/rest/v3/#Body-Parameters-34268) structure.
     * @params {string} storyType - The type of story (feature, bug, chore).
     * @params {array} tasks - An array of tasks connected to the story. Each task must have the
     * [CreateTaskParams](https://clubhouse.io/api/rest/v3/#CreateTaskParams) structure.
     * @params {string} updatedAt - The time/date the story was updated.
     * @params {integer} workflowStateId - The ID of the workflow state the story will be in.
     * @returns {story: object } An object with the created story, as per input provided, default
     * values. See the full schema at
     * [Create Story Responses](https://clubhouse.io/api/rest/v3/#Responses-80269).
     */
    async createStory(data) {
      return await this.api().createStory(data);
    },
    /**
     * Returns a list of all Epics and their attributes.
     * @returns {epics: array } An array of all epics in the connected Clubhouse account.
     * See the [Epic schema](https://clubhouse.io/api/rest/v3/#Epic) at the API docs.
     */
    async listEpics() {
      return await this.api().listEpics();
    },
    /**
     * Returns a list of all Linked Files.
     * @returns {linkedFiles: array } An array of all linked files in the connected Clubhouse
     * account.
     * See the [Linked File schema](https://clubhouse.io/api/rest/v3/#LinkedFile) at the API docs.
     */
    async listLinkedFiles() {
      return await this.api().listLinkedFiles();
    },
    /**
     * Returns a list of all Members and their attributes.
     * @returns {members: array } An array of all members in the connected Clubhouse account.
     * See the [Members schema](https://clubhouse.io/api/rest/v3/#Member-1426) at the API docs.
     */
    async listMembers() {
      return await this.api().listMembers();
    },
    /**
     * Returns a list of all Members as options to use as dynamically populated prop's options.
     * @returns {members: array } An array where each element has the `value` and `label`
     * properties, to be used as dynamically populated prop's options. `value` is set to the `id`
     * of the Clubhouse member, and `label` to the member's name.
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
     * @returns {members: array } An array of all projects in the connected Clubhouse account.
     * See the [Projects schema](https://clubhouse.io/api/rest/v3/#Project) at the API docs.
     */
    async listProjects() {
      return await this.api().listProjects();
    },
    /**
     * Returns a list of all Workflows and their attributes.
     * @returns {workflows: array } An array of all Workflows in the connected Clubhouse account.
     * See the [Workflow schema](https://clubhouse.io/api/rest/v3/#Workflow) at the API docs.
     */
    async listWorkflows() {
      return await this.api().listWorkflows();
    },
    /**
     * Searches for stories in your clubhouse.
     * @params {string} query - The search query based on the
     * [Search page](https://help.clubhouse.io/hc/en-us/articles/115005967026)
     * [search operators]
     * (https://help.clubhouse.io/hc/en-us/articles/360000046646-Search-Operators)
     * to use for finding stories.
     * @params {integer} numberOfStories - The number of stories to return.
     * @returns {stories: array } An array stories matching the `query` parameter. Number of
     *  results are limited by `numberOfStories`.
     */
    async searchStories(query, numberOfStories) {
      let stories = [];
      const processResult = async function(result) {
        stories = stories.concat(result.data);
        if (stories.length >= numberOfStories || !result.fetchNext) {
          return stories.slice(0, numberOfStories);
        }
        const nextResult = await this._withRetries( () => result.fetchNext());
        return await processResult(nextResult);
      };
      let result;
      try {
        result = await this._withRetries(() =>
          this.api().searchStories(query, Math.min(numberOfStories, 25)));
      } catch (err) {
        throw new Error(err.message);
      }
      return await processResult(result);
    },
  },
};
