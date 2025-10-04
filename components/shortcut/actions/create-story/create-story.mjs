import shortcut from "../../shortcut.app.mjs";
import lodash from "lodash";
import validate from "validate.js";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "shortcut-create-story",
  name: "Create Story",
  description: "Creates a new story in your Shortcut account. See [Create Story](https://shortcut.com/api/rest/v3#Create-Story) in Shortcut Rest API, V3 reference for endpoint documentation.",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shortcut,
    workflowStateId: {
      type: "integer",
      label: "Workflow State Id",
      description: "The ID of the workflow state the story will be in.",
      async options() {
        let options = [];
        const workflows = await this.shortcut.callWithRetry("listWorkflows");
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the story.",
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Controls the story's archived state.",
      optional: true,
    },
    comment: {
      type: "object",
      label: "Comment",
      description:
        "A comment object attached to the story must have the following structure: `author_id` which is the member ID of the Comment's author  (defaults to the user identified by the API token), `created_at` which defaults to the time/date the comment is created, but can be set to reflect another date, `external_id` field that can be set to another unique ID. In the case that the comment has been imported from another tool, the ID in the other tool can be indicated here, `text` is the comment text, and `updated_at` which defaults to the time/date the comment is last updated in Shortcut but can be set to reflect another time/date. See [CreateStoryCommentParams](https://shortcut.com/api/rest/v3#CreateStoryCommentParams) for more info.",
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
        let options = [];
        const epics = await this.shortcut.callWithRetry("listEpics");
        const isEpicDataAvailable = lodash.get(epics, [
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
      description: "An array of IDs of files attached to the story.",
      async options() {
        let options = [];
        const files = await this.shortcut.callWithRetry("listFiles");
        const isFileDataAvailable = lodash.get(files, [
          "data",
          "length",
        ]);
        if (!isFileDataAvailable) {
          return options;
        }
        options = files.data.map((file) => ({
          label: file.name,
          value: file.id,
        }));
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
        let options = [];
        const iterations = await this.shortcut.callWithRetry("listIterations");
        const isIterationDataAvailable = lodash.get(iterations, [
          "data",
          "length",
        ]);
        if (!isIterationDataAvailable) {
          return options;
        }
        options = iterations.data.map((iteration) => ({
          label: iteration.name,
          value: iteration.id,
        }));
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
        "An array of IDs of linked files attached to the story.",
      async options() {
        let options = [];
        const linkedFiles = await this.shortcut.callWithRetry("listLinkedFiles");
        const isLinkedFilesDataAvailable = lodash.get(linkedFiles, [
          "data",
          "length",
        ]);
        if (!isLinkedFilesDataAvailable) {
          return options;
        }
        options = linkedFiles.data.map((linkedFile) => ({
          label: linkedFile.name,
          value: linkedFile.id,
        }));
        return options;
      },
      optional: true,
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
        "An story link object attached to the story must have the following structure: `object_id` is the unique ID of the story defined as object, `subject_id` is the unique ID of the story defined as subject, and `verb` which indicates how the subject story acts on the object story, valid values are `blocks`, `duplicates`, or `relates to`. See [CreateStoryLinkParams](https://shortcut.com/api/rest/v3#CreateStoryLinkParams) for more info.",
      optional: true,
    },
    storyType: {
      type: "string",
      label: "Story Type",
      description: "The type of story (feature, bug, chore).",
      options: constants.STORY_TYPES,
      default: "feature",
      optional: true,
    },
    task: {
      type: "object",
      label: "Task",
      description:
        "A task object attached to the story must have the following structure: `complete` which is a boolean, indicating whether the task is completed (defaults to `false`), `created_at` which defaults to the time/date the task is created but can be set to reflect another creation time/date, `description` as a description for the task, `external_id` a field can be set to another unique ID. In the case that the task has been imported from another tool, the ID in the other tool can be indicated here, `owner_ids` as an array of UUIDs for any members you want to add as owners on this new task, `updated_at` which defaults to the time/date the task was last updated in Shortcut but can be set to reflect another time/date. See [CreateTaskParams](https://shortcut.com/api/rest/v3#CreateTaskParams) for more info.",
      optional: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated at Date",
      description: "The time/date the story was updated.",
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
      requested_by_id: this.requestedById,
      started_at_override: this.startedAtOverride,
      story_type: this.storyType,
      updated_at: this.updatedAt,
      workflow_state_id: this.workflowStateId,
      ...(this.comment
        ? {
          comments: [
            utils.parseJson(this.comment),
          ],
        }
        : undefined
      ),
      ...(this.label
        ? {
          labels: [
            utils.parseJson(this.label),
          ],
        }
        : undefined
      ),
      ...(this.storyLink
        ? {
          story_links: [
            utils.parseJson(this.storyLink),
          ],
        }
        : undefined
      ),
      ...(this.task
        ? {
          tasks: [
            utils.parseJson(this.task),
          ],
        }
        : undefined
      ),
    };

    const resp = await this.shortcut.callWithRetry("createStory", story);
    return resp.data;
  },
};
