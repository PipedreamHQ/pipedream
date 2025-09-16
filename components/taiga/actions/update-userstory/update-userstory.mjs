import {
  cleanObj, parseObject,
} from "../../common/utils.mjs";
import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-update-userstory",
  name: "Update User Story",
  description: "Update an existing user story in a Taiga project. [See the documentation](https://docs.taiga.io/api.html#_user_stories)",
  version: "0.0.1",
  type: "action",
  props: {
    taiga,
    projectId: {
      propDefinition: [
        taiga,
        "projectId",
      ],
    },
    userStoryId: {
      propDefinition: [
        taiga,
        "userStoryId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    subject: {
      propDefinition: [
        taiga,
        "userStorySubject",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        taiga,
        "userStoryDescription",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        taiga,
        "userStoryStatus",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        taiga,
        "userId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      label: "Assigned To",
      description: "User to assign the user story to",
      optional: true,
    },
    tags: {
      propDefinition: [
        taiga,
        "tags",
      ],
      description: "Tags to associate with the user story",
      optional: true,
    },
    backlogOrder: {
      propDefinition: [
        taiga,
        "backlogOrder",
      ],
      optional: true,
    },
    kanbanOrder: {
      propDefinition: [
        taiga,
        "kanbanOrder",
      ],
      optional: true,
    },
    sprintOrder: {
      propDefinition: [
        taiga,
        "sprintOrder",
      ],
      optional: true,
    },
    clientRequirement: {
      propDefinition: [
        taiga,
        "clientRequirement",
      ],
      optional: true,
    },
    isBlocked: {
      propDefinition: [
        taiga,
        "isBlocked",
      ],
      description: "Whether the user story is blocked",
      optional: true,
    },
    milestone: {
      propDefinition: [
        taiga,
        "milestone",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      description: "Milestone to associate the user story with",
      optional: true,
    },
    points: {
      propDefinition: [
        taiga,
        "points",
      ],
      optional: true,
    },
    teamRequirement: {
      propDefinition: [
        taiga,
        "teamRequirement",
      ],
      optional: true,
    },
    watchers: {
      propDefinition: [
        taiga,
        "userId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      type: "string[]",
      label: "Watchers",
      description: "Users to watch the user story",
      optional: true,
    },
  },
  async run({ $ }) {
    const userStory = await this.taiga.getUserStory({
      userStoryId: this.userStoryId,
    });
    const response = await this.taiga.updateUserStory({
      $,
      userStoryId: this.userStoryId,
      data: cleanObj({
        version: userStory.version,
        subject: this.subject,
        description: this.description,
        status: this.status,
        assigned_to: this.assignedTo,
        tags: parseObject(this.tags),
        backlog_order: this.backlogOrder,
        client_requirement: this.clientRequirement,
        is_blocked: this.isBlocked,
        milestone: this.milestone,
        points: parseObject(this.points),
        team_requirement: this.teamRequirement,
        watchers: parseObject(this.watchers),
      }),
    });

    $.export("$summary", `Updated user story: ${response.id}`);
    return response;
  },
};
