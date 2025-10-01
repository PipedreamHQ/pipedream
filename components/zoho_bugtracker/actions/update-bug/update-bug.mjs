import FormData from "form-data";
import { clearObj } from "../../common/utils.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import zohoBugtracker from "../../zoho_bugtracker.app.mjs";

export default {
  key: "zoho_bugtracker-update-bug",
  name: "Update Bug",
  version: "0.1.2",
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
    title: {
      propDefinition: [
        zohoBugtracker,
        "title",
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
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
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
      label: "Affected Milestone Id",
      optional: true,
    },
    uploaddoc: {
      propDefinition: [
        zohoBugtracker,
        "uploaddoc",
      ],
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      zohoBugtracker,
      portalId,
      projectId,
      bugId,
      milestoneId,
      dueDate,
      affectedMileId,
      bugFollowers,
      classificationId,
      moduleId,
      severityId,
      reproducibleId,
      statusId,
      uploaddoc,
      ...data
    } = this;

    const formData = new FormData();
    const preData = clearObj({
      ...data,
      classification_id: classificationId,
      milestone_id: milestoneId,
      due_date: dueDate,
      module_id: moduleId,
      severity_id: severityId,
      reproducible_id: reproducibleId,
      status_id: statusId,
      affectedMile_id: affectedMileId,
      bug_followers: bugFollowers,
    });

    for (const [
      key,
      value,
    ] of Object.entries(preData)) {
      formData.append(key, value);
    }

    if (uploaddoc) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(uploaddoc);
      const filename = metadata.name;
      formData.append("uploaddoc", stream, {
        filename,
        contentType: metadata.contentType,
        knownLength: metadata.size,
        header: [
          `Content-Disposition: form-data; name="uploaddoc"; filename="${filename}"`,
          `Content-Type: ${metadata.contentType}`,
        ],
      });
    }

    const response = await zohoBugtracker.updateBug({
      $,
      portalId,
      projectId,
      bugId,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    });

    $.export("$summary", `Successfully updated bug with Id: ${bugId}!`);
    return response;
  },
};
