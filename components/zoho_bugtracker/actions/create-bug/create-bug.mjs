import { clearObj } from "../../common/utils.mjs";
import zohoBugtracker from "../../zoho_bugtracker.app.mjs";

export default {
  key: "zoho_bugtracker-create-bug",
  name: "Create Bug",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new bug [See the documentation](https://projects.zoho.com/api-docs#issues#create-an-issue)",
  type: "action",
  props: {
    zohoBugtracker,
    portalId: {
      propDefinition: [
        zohoBugtracker,
        "portalId",
      ],
    },
    projectId: {
      propDefinition: [
        zohoBugtracker,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
    name: {
      propDefinition: [
        zohoBugtracker,
        "name",
      ],
    },
    description: {
      propDefinition: [
        zohoBugtracker,
        "description",
      ],
      optional: true,
    },
    assignee: {
      propDefinition: [
        zohoBugtracker,
        "assignee",
        ({ portalId }) => ({
          portalId,
        }),
      ],
      optional: true,
    },
    flag: {
      propDefinition: [
        zohoBugtracker,
        "flag",
      ],
      optional: true,
    },
    /* classificationId: {
      propDefinition: [
        zohoBugtracker,
        "classificationId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
      optional: true,
    }, */
    milestoneId: {
      propDefinition: [
        zohoBugtracker,
        "milestoneId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date of the bug. Example: `2025-12-12T02:12:00.000Z`",
      optional: true,
    },
    /*  moduleId: {
      propDefinition: [
        zohoBugtracker,
        "moduleId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
      optional: true,
    },
    severityId: {
      propDefinition: [
        zohoBugtracker,
        "severityId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
      optional: true,
    },
    reproducibleId: {
      propDefinition: [
        zohoBugtracker,
        "reproducibleId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
      optional: true,
    }, */
    affectedMileId: {
      propDefinition: [
        zohoBugtracker,
        "milestoneId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
      label: "Affected Milestone ID",
      optional: true,
    },
    bugFollowers: {
      propDefinition: [
        zohoBugtracker,
        "bugFollowers",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      zohoBugtracker,
      portalId,
      projectId,
      milestoneId,
      dueDate,
      affectedMileId,
      bugFollowers,
      assignee,
      classificationId,
      moduleId,
      severityId,
      reproducibleId,
      ...data
    } = this;

    const preData = clearObj({
      ...data,
      classification: classificationId
        ? {
          id: classificationId,
        }
        : undefined,
      release_milestone: milestoneId
        ? {
          id: milestoneId,
        }
        : undefined,
      due_date: dueDate,
      module: moduleId
        ? {
          id: moduleId,
        }
        : undefined,
      severity: severityId
        ? {
          id: severityId,
        }
        : undefined,
      is_it_reproducible: reproducibleId
        ? {
          id: reproducibleId,
        }
        : undefined,
      affected_milestone: affectedMileId
        ? {
          id: affectedMileId,
        }
        : undefined,
      followers: bugFollowers
        ? bugFollowers.map((follower) => ({
          zpuid: follower,
        }))
        : undefined,
      assignee: assignee
        ? {
          zpuid: assignee,
        }
        : undefined,
    });

    const response = await zohoBugtracker.createBug({
      $,
      portalId,
      projectId,
      data: preData,
    });

    $.export("$summary", `A new bug with ID: ${response.id} was successfully created!`);
    return response;
  },
};
