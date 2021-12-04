const shortcut = require("../../shortcut.app");
const get = require("lodash/get");
const validate = require("validate.js");

module.exports = {
  key: "shortcut-create-story",
  name: "Create Story",
  description: "Creates a new story in your Shortcut account.",
  version: "0.0.30",
  type: "action",
  props: {
    shortcut,
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Controls the story’s archived state.",
      default: false,
    },
    comment: {
      type: "object",
      label: "Comment",
      description:
        "A comment object attached to the story. Each comment object must have the following structure: `author_id` which is the member ID of the Comment’s author  (defaults to the user identified by the API token), a date `created_at` which defaults to the time/date the comment is created, but can be set to reflect another date, `external_id` a field that can be set to another unique ID. In the case that the comment has been imported from another tool, the ID in the other tool can be indicated here `text` with the comment text, and `updated_at` which defaults to the time/date the comment is last updated in Shortcut but can be set to reflect another time/date. See [CreateStoryCommentParams](https://shortcut.com/api/rest/v3#CreateStoryCommentParams) for more info.",
      optional: true,
    },
    completedAtOverride: {
      type: "string",
      label: "Completed at Override Date",
      description:
        "A manual override for the time/date the Story was completed.",
      optional: true,
    },
    createdAt: {
      type: "string",
      label: "Created at Date",
      description: "The time/date the Story was created.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the story.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the story.",
      default: "",
      optional: true,
    },
    epicId: {
      type: "integer",
      label: "Epic ID",
      description: "The unique identifier of the epic the story belongs to.",
      async options() {
        const options = [];
        const epics = await this.shortcut.callWithRetry("listEpics");
        epics.forEach((epic) => {
          options.push({
            label: epic.name,
            value: epic.id,
          });
        });
        return options;
      },
      optional: true,
    },
    estimate: {
      type: "integer",
      label: "Estimate",
      description:
        "The numeric point estimate of the story. Can also be null, which means unestimated.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External Id",
      description:
        "This field can be set to another unique ID. In the case that the Story has been imported from another tool, the ID in the other tool can be indicated here.",
      optional: true,
    },
    externalLinks: {
      type: "string[]",
      label: "External Links",
      description: "A string array of External Links associated with this story.",
      optional: true,
    },
    fileIds: {
      type: "integer[]",
      label: "File Ids",
      description: "An integer array of IDs of files attached to the story.",
      async options() {
        const options = [];
        const files = await this.shortcut.callWithRetry("listFiles");
        files.forEach((file) => {
          options.push({
            label: file.name,
            value: file.id,
          });
        });
        return options;
      },
      optional: true,
    },
    followerIds: {
      type: "string[]",
      label: "Follower Ids",
      description: "A string array of UUIDs of the followers of this story.",
      async options() {
        return await this.shortcut.listMembersAsOptions();
      },
      optional: true,
    },
    iterationId: {
      type: "integer",
      label: "Iteration Id",
      description: "The ID of the iteration the story belongs to.",
      async options() {
        const options = [];
        const iterations = await this.shortcut.callWithRetry("listIterations");
        iterations.forEach((iteration) => {
          options.push({
            label: iteration.name,
            value: iteration.id,
          });
        });
        return options;
      },
      optional: true,
    },
    label: {
      type: "object",
      label: "Label",
      description:
        "A label object attached to the story. Each label object must have the following structure: `color` which is an string with the hex color to be displayed with the Label i.e. \"#ff0000\", and a string `name` for the name of the Label. See [CreateLabelParams](https://shortcut.com/api/rest/v3#CreateLabelParams) for more info.",
      optional: true,
    },
    linkedFileIds: {
      type: "integer[]",
      label: "Linked File Ids",
      description:
        "An integer array with the IDs of linked files attached to the story.",
      async options() {
        const options = [];
        const linkedFiles = await this.shortcut.callWithRetry("listLinkedFiles");
        linkedFiles.forEach((linkedFile) => {
          options.push({
            label: linkedFile.name,
            value: linkedFile.id,
          });
        });
        return options;
      },
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the story.",
    },
    ownerIds: {
      type: "string[]",
      label: "Owner Ids",
      description: "A string array of UUIDs of the owners of this story.",
      async options() {
        return await this.shortcut.listMembersAsOptions();
      },
      optional: true,
    },
    projectId: {
      type: "integer",
      label: "Project Id",
      description: "The ID of the project the story belongs to.",
      async options() {
        const projects = await this.shortcut.callWithRetry("listProjects");
        const options = projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
        return options;
      },
    },
    requestedById: {
      type: "string",
      label: "Requested by ID",
      description: "The ID of the member that requested the story.",
      async options() {
        return await this.shortcut.listMembersAsOptions();
      },
      optional: true,
    },
    startedAtOverride: {
      type: "string",
      label: "Started at Override Date",
      description: "A manual override for the time/date the Story was started.",
      optional: true,
    },
    storyLink: {
      type: "object",
      label: "Story Link",
      description:
        "An story link object attached to the story. Each story link object must have the following structure: `object_id` which is an integer, unique ID of the story defined as object, `subject_id` which is an integer, unique ID of the story defined as subject, and `verb` which indicates how the subject story acts on the object story, valid values are `blocks`, `duplicates`, or `relates to`. See [CreateStoryLinkParams](https://shortcut.com/api/rest/v3#CreateStoryLinkParams) for more info.",
      optional: true,
    },
    storyType: {
      type: "string",
      label: "Story Type",
      description: "The type of story (feature, bug, chore).",
      options: [
        "bug",
        "chore",
        "feature",
      ],
      default: "feature",
      optional: true,
    },
    task: {
      type: "object",
      label: "Task",
      description:
        "A task object attached to the story. Each task object must have the following structure: `complete` which is a boolean, indicating whether the task is completed (defaults to `false`), `created_at` which defaults to the time/date the task is created but can be set to reflect another creation time/date, `description` as a description for the task, `external_id` a field can be set to another unique ID. In the case that the task has been imported from another tool, the ID in the other tool can be indicated here, `owner_ids` as an array of UUIDs for any members you want to add as owners on this new task, `updated_at` which defaults to the time/date the task was last updated in Shortcut but can be set to reflect another time/date.  See [CreateTaskParams](https://shortcut.com/api/rest/v3#CreateTaskParams) for more info.",
      optional: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated at Date",
      description: "The time/date the story was updated.",
      optional: true,
    },
    workflowStateId: {
      type: "integer",
      label: "Workflow State Id",
      description: "The ID of the workflow state the story will be in.",
      async options() {
        const workflows = await this.shortcut.callWithRetry("listWorkflows");
        return workflows.reduce(function (options, workflow) {
          const hasState = get(workflow, [
            "states",
            "length",
          ]);
          if (!hasState) {
            return options;
          }
          const optionsToAdd = workflow.states.map((state) => ({
            label: `${state.name} (${workflow.name})`,
            value: `${state.id}`,
          }));
          return options.concat(optionsToAdd);
        }, []);
      },
      optional: true,
    },
  },
  async run() {
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
    };
    if (this.externalLinks) {
      constraints.externalLinks = {
        type: "array",
      };
    }
    if (this.fileIds) {
      constraints.fileIds = {
        type: "array",
      };
    }
    if (this.followerIds) {
      constraints.followerIds = {
        type: "array",
      };
    }
    if (this.linkedFileIds) {
      constraints.linkedFileIds = {
        type: "array",
      };
    }
    if (this.ownerIds) {
      constraints.ownerIds = {
        type: "array",
      };
    }
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
    this.shortcut.checkValidationResults(validationResult);
    const story = {
      archived: this.archived,
      completed_at_override: this.completedAtOverride,
      created_at: this.createdAt,
      deadline: this.dueDate,
      description: this.description,
      epic_id: this.epicId,
      estimate: this.estimate,
      external_id: this.externalId,
      external_links: this.shortcut.convertEmptyStringToUndefined(this.externalLinks),
      file_ids: this.shortcut.convertEmptyStringToUndefined(this.fileIds),
      follower_ids: this.shortcut.convertEmptyStringToUndefined(this.followerIds),
      iteration_id: this.iterationId,
      linked_file_ids: this.shortcut.convertEmptyStringToUndefined(this.linkedFileIds),
      name: this.name,
      owner_ids: this.shortcut.convertEmptyStringToUndefined(this.ownerIds),
      project_id: this.projectId,
      requested_by_id: this.requestedById,
      started_at_override: this.startedAtOverride,
      story_type: this.storyType,
      updated_at: this.updatedAt,
      workflow_state_id: this.workflowStateId,
    };
    const comment = this.shortcut.convertEmptyStringToUndefined(this.comment);
    if (comment) {
      story.comments = [
        comment,
      ];
    }
    const label = this.shortcut.convertEmptyStringToUndefined(this.label);
    if (label) {
      story.labels = [
        label,
      ];
    }
    const storyLink = this.shortcut.convertEmptyStringToUndefined(this.storyLink);
    if (storyLink) {
      story.story_links = [
        storyLink,
      ];
    }
    const task = this.shortcut.convertEmptyStringToUndefined(this.task);
    if (task) {
      story.tasks = [
        task,
      ];
    }
    return await this.shortcut.callWithRetry("createStory", story);
  },
};
