const clubhouse = require("../../clubhouse.app.js");
const get = require("lodash/get");
const validate = require("validate.js");

module.exports = {
  key: "clubhouse-create-story",
  name: "Create Story",
  description: "Creates a new story in your clubhouse.",
  version: "0.0.1",
  type: "action",
  props: {
    clubhouse,
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Controls the story’s archived state.",
      default: false,
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description:
        "An array with comment objects to add to the story. Each comment object must have the [CreateStoryCommentParams](https://clubhouse.io/api/rest/v3/#CreateStoryCommentParams) structure. Alternatively, provide a string that will `JSON.parse` to an array of comment objects. ",
      default: "",
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
        const epics = await this.clubhouse.callWithRetry("listEpics");
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
        const files = await this.clubhouse.callWithRetry("listFiles");
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
        return await this.clubhouse.listMembersAsOptions();
      },
      optional: true,
    },
    groupId: {
      type: "string",
      label: "Group Id",
      description: "The id of the group to associate with this story. A group in Clubhouse API maps to a \"Team\" within the Clubhouse Product.",
      optional: true,
    },
    iterationId: {
      type: "integer",
      label: "Iteration Id",
      description: "The ID of the iteration the story belongs to.",
      async options() {
        const options = [];
        const iterations = await this.clubhouse.callWithRetry("listIterations");
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
        "A label object attached to the story. Each label object must have the following structure: `color` which is an string with the hex color to be displayed with the Label i.e. \"#ff0000\", and a string `name` for the name of the Label.",
      optional: true,
    },
    linkedFileIds: {
      type: "integer[]",
      label: "Linked File Ids",
      description:
        "An integer array with the IDs of linked files attached to the story.",
      async options() {
        const options = [];
        const linkedFiles = await this.clubhouse.callWithRetry("listLinkedFiles");
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
        return await this.clubhouse.listMembersAsOptions();
      },
      optional: true,
    },
    projectId: {
      type: "integer",
      label: "Project Id",
      description: "The ID of the project the story belongs to.",
      async options() {
        const options = [];
        const projects = await this.clubhouse.callWithRetry("listProjects");
        projects.forEach((project) => {
          options.push({
            label: project.name,
            value: project.id,
          });
        });
        return options;
      },
    },
    requestedById: {
      type: "string",
      label: "Requested by ID",
      description: "The ID of the member that requested the story.",
      async options() {
        return await this.clubhouse.listMembersAsOptions();
      },
      optional: true,
    },
    startedAtOverride: {
      type: "string",
      label: "Started at Override Date",
      description: "A manual override for the time/date the Story was started.",
      optional: true,
    },
    storyLinks: {
      type: "string",
      label: "Story Links",
      description:
        "An array of story link objects attached to the story. Each story link object must have the [CreateStoryLinkParams](https://clubhouse.io/api/rest/v3/#Body-Parameters-34268) structure. Alternatively, provide a string that will `JSON.parse` to an array of story link objects. ",
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
    tasks: {
      type: "string",
      label: "Tasks",
      description:
        "An array of task objects connected to the story. Each task object must have the [CreateTaskParams](https://clubhouse.io/api/rest/v3/#CreateTaskParams) structure. Alternatively, provide a string that will `JSON.parse` to an array of content objects. ",
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
        const workflows = await this.clubhouse.callWithRetry("listWorkflows");
        return workflows.reduce(function (options, workflow) {
          const hasState = get(workflow, [
            "states",
            "length",
          ]);
          if (hasState) {
            workflow.states.map((state) => (options.push({
              label: `${state.name} (${workflow.name})`,
              value: `${state.id}`,
            })));
          }
          return options;
        }, []);
      },
      optional: true,
    },
  },
  async run() {
    const constraints = {
      name: {
        presence: true,
        length: {
          maximum: 512,
        },
      },
      projectId: {
        presence: true,
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
    if (this.comments) {
      constraints.comments = {
        arrayValidator: {
          value: this.comments,
          key: "comment",
        },
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
    if (this.storyLinks) {
      constraints.storyLinks = {
        arrayValidator: {
          value: this.storyLinks,
          key: "story link",
        },
      };
    }
    if (this.tasks) {
      constraints.tasks = {
        arrayValidator: {
          value: this.tasks,
          key: "task",
        },
      };
    }
    const validationResult = validate(
      {
        comments: this.comments,
        name: this.name,
        projectId: this.projectId,
        description: this.description,
        externalLinks: this.externalLinks,
        fileIds: this.fileIds,
        followerIds: this.followerIds,
        linkedFileIds: this.linkedFileIds,
        ownerIds: this.ownerIds,
        storyLinks: this.storyLinks,
        tasks: this.tasks,
      },
      constraints,
    );
    this.clubhouse.checkValidationResults(validationResult);
    const story = {
      archived: this.archived,
      comments: this.clubhouse.getArrayObject(this.comments),
      completed_at_override: this.completedAtOverride,
      created_at: this.createdAt,
      deadline: this.dueDate,
      description: this.description,
      epic_id: this.epicId,
      estimate: this.estimate,
      external_id: this.externalId,
      external_links: this.clubhouse.convertEmptyStringToUndefined(this.externalLinks),
      file_ids: this.clubhouse.convertEmptyStringToUndefined(this.fileIds),
      follower_ids: this.clubhouse.convertEmptyStringToUndefined(this.followerIds),
      group_id: this.groupId,
      iteration_id: this.iterationId,
      linked_file_ids: this.clubhouse.convertEmptyStringToUndefined(this.linkedFileIds),
      name: this.name,
      owner_ids: this.clubhouse.convertEmptyStringToUndefined(this.ownerIds),
      project_id: this.projectId,
      requested_by_id: this.requestedById,
      started_at_override: this.startedAtOverride,
      story_links: this.clubhouse.getArrayObject(this.storyLinks),
      story_type: this.storyType,
      tasks: this.clubhouse.getArrayObject(this.tasks),
      updated_at: this.updatedAt,
      workflow_state_id: this.workflowStateId,
    };
    const label = this.clubhouse.convertEmptyStringToUndefined(this.label);
    if (label) {
      story.labels = [
        label,
      ];
    }
    return await this.clubhouse.callWithRetry("createStory", story);
  },
};
