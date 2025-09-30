import pivotalTracker from "../../pivotal_tracker.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Create Story",
  key: "pivotal_tracker-create-story",
  description: "Create a new story in a project. [See the docs here](https://www.pivotaltracker.com/help/api/rest/v5#projects_project_id_stories_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pivotalTracker,
    projectId: {
      propDefinition: [
        pivotalTracker,
        "projectId",
      ],
    },
    name: {
      propDefinition: [
        pivotalTracker,
        "name",
      ],
      description: "Name of the new story",
    },
    description: {
      propDefinition: [
        pivotalTracker,
        "description",
      ],
      description: "Description of the story",
    },
    storyType: {
      type: "string",
      label: "Story Type",
      description: "The type of the story",
      options: constants.STORY_TYPES,
      optional: true,
    },
    currentState: {
      type: "string",
      label: "Current State",
      description: "Story's state of completion",
      options: constants.STORY_STATES,
      optional: true,
    },
    storyPriority: {
      type: "string",
      label: "Story Priority",
      description: "Priority of the new story",
      options: constants.STORY_PRIORITIES,
      optional: true,
    },
    estimate: {
      type: "integer",
      label: "Estimate",
      description: "Point value of the story",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.estimate && (
      this.currentState === "accepted"
      || this.currentState === "delivered"
      || this.currentState === "finished"
      || this.currentState === "started"
      || this.currentState === "rejected"
      || this.currentState === "planned"
    )) {
      throw new ConfigurationError(`Stories in the \`${this.currentState}\` state must include an estimate.`);
    }

    const data = {
      name: this.name,
      description: this.description,
      story_type: this.storyType,
      current_state: this.currentState,
      story_priority: this.storyPriority,
      estimate: this.estimate,
    };

    const response = await this.pivotalTracker.createStory(this.projectId, {
      data,
      $,
    });

    $.export("$summary", `Successfully created story with ID ${response.id}`);

    return response;
  },
};
