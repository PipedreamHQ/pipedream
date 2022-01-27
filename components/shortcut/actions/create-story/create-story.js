const shortcut = require("../../shortcut.app");
const get = require("lodash/get");
const validate = require("validate.js");
const utils = require("../../utils");
const constants = require("../../constants");

module.exports = {
  key: "shortcut-create-story",
  name: "Create Story",
  description: "Creates a new story in your Shortcut account. See [Create Story](https://shortcut.com/api/rest/v3#Create-Story) in Shortcut Rest API, V3 reference for endpoint documentation.",
  version: "0.0.1",
  type: "action",
  props: {
    shortcut,
    description: {
      type: "string",
      label: "Description",
      optional: true,
    },
    epicId: {
      type: "integer",
      label: "Epic",
      description: "The epic the story belongs to",
      async options() {
        let options = [];
        const epics = await this.shortcut.callWithRetry("listEpics");
        const isEpicDataAvailable = get(epics, [
          "data",
          "length",
        ]);
        if (!isEpicDataAvailable) {
          return options;
        }
        options = epics.data.map((epic) => ({
          label: epic.name,
          value: epic.id,
        }));
        return options;
      },
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
    },
    projectId: {
      type: "integer",
      label: "Project",
      description: "The project the story belongs to",
      async options() {
        let options = [];
        const projects = await this.shortcut.callWithRetry("listProjects");
        const isProjectDataAvailable = get(projects, [
          "data",
          "length",
        ]);
        if (!isProjectDataAvailable) {
          return options;
        }
        options = projects.data.map((project) => ({
          label: project.name,
          value: project.id,
        }));
        return options;
      },
    },
    storyType: {
      type: "string",
      label: "Story Type",
      description: "The type of story (feature, bug, chore)",
      options: constants.STORY_TYPES,
      default: "feature",
      optional: true,
    },
  },
  async run({ $ }) {
    const constraints = {
      name: {
        length: {
          maximum: 512,
        },
      },
      description: {
        length: {
          maximum: 100000,
        },
      },
      externalLinks: utils.validateArrayWhenPresent,
      fileIds: utils.validateArrayWhenPresent,
      followerIds: utils.validateArrayWhenPresent,
      inkedFileIds: utils.validateArrayWhenPresent,
      ownerIds: utils.validateArrayWhenPresent,
    };
    const validationResult = validate(
      {
        name: this.name,
        description: this.description,
        externalLinks: this.externalLinks,
        fileIds: this.fileIds,
        followerIds: this.followerIds,
        linkedFileIds: this.linkedFileIds,
        ownerIds: this.ownerIds,
      },
      constraints,
    );
    utils.checkValidationResults(validationResult);
    const story = {
      archived: this.archived,
      completed_at_override: this.completedAtOverride,
      created_at: this.createdAt,
      deadline: this.dueDate,
      description: this.description,
      epic_id: this.epicId,
      estimate: this.estimate,
      external_id: this.externalId,
      external_links: this.externalLinks,
      file_ids: this.fileIds,
      follower_ids: this.followerIds,
      iteration_id: this.iterationId,
      linked_file_ids: this.linkedFileIds,
      name: this.name,
      owner_ids: this.ownerIds,
      project_id: this.projectId,
      requested_by_id: this.requestedById,
      started_at_override: this.startedAtOverride,
      story_type: this.storyType,
      updated_at: this.updatedAt,
      workflow_state_id: this.workflowStateId,
    };
    const comment = utils.convertEmptyStringToUndefined(this.comment);
    if (comment) {
      story.comments = [
        comment,
      ];
    }
    const label = utils.convertEmptyStringToUndefined(this.label);
    if (label) {
      story.labels = [
        label,
      ];
    }
    const storyLink = utils.convertEmptyStringToUndefined(this.storyLink);
    if (storyLink) {
      story.story_links = [
        storyLink,
      ];
    }
    const task = utils.convertEmptyStringToUndefined(this.task);
    if (task) {
      story.tasks = [
        task,
      ];
    }
    $.export("$summary", "Successfully created a new story")
    return this.shortcut.callWithRetry("createStory", story);
  },
};
