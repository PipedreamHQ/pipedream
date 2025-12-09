import { clearObj } from "../../common/utils.mjs";
import zohoBugtracker from "../../zoho_bugtracker.app.mjs";

export default {
  key: "zoho_bugtracker-update-bug",
  name: "Update Bug",
  //version: "0.1.2",
  version: "0.1.{{ts}}",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a specific bug [See the documentation](https://www.zoho.com/projects/help/rest-api/bugtracker-bugs-api.html#alink4)",
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
    bugId: {
      propDefinition: [
        zohoBugtracker,
        "bugId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
    },
    name: {
      propDefinition: [
        zohoBugtracker,
        "name",
      ],
      optional: true,
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
    bugFollowers: {
      propDefinition: [
        zohoBugtracker,
        "bugFollowers",
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
    classificationId: {
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
    },
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
      description: "Due date of the bug. **Format MM-DD-YYYY**",
      optional: true,
    },
    moduleId: {
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
    },
    statusId: {
      propDefinition: [
        zohoBugtracker,
        "statusId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
      optional: true,
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "Resolution text. If you fill in the resolution, no other properties will be updated.",
      optional: true,
    },
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
  },
  async run({ $ }) {
    const {
      zohoBugtracker,
      portalId,
      projectId,
      bugId,
      assignee,
      milestoneId,
      dueDate,
      affectedMileId,
      bugFollowers,
      classificationId,
      moduleId,
      severityId,
      reproducibleId,
      statusId,
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
      status: statusId
        ? {
          id: statusId,
        }
        : undefined,
      affected_milestone: affectedMileId
        ? {
          id: affectedMileId,
        }
        : undefined,
      followers: bugFollowers,
      assignee: assignee
        ? {
          zpuid: assignee,
        }
        : undefined,
    });

    const response = await zohoBugtracker.updateBug({
      $,
      portalId,
      projectId,
      bugId,
      data: preData,
    });

    $.export("$summary", `Successfully updated bug with Id: ${bugId}!`);
    return response;
  },
};
