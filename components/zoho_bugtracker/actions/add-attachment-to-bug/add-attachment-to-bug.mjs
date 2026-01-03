import zohoBugtracker from "../../zoho_bugtracker.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "zoho_bugtracker-add-attachment-to-bug",
  name: "Add Attachment To Bug",
  description: "Adds an attachment to a bug. [See the documentation](https://projects.zoho.com/api-docs#issue-attachment#associate-attachments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    uploaddoc: {
      propDefinition: [
        zohoBugtracker,
        "uploaddoc",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const form = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.uploaddoc);

    form.append("upload_file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    form.append("attachment_details[storage_type]", "WorkDrive");
    form.append("attachment_details[location_details][project_id]", this.projectId);

    const { attachment } = await this.zohoBugtracker.uploadGlobalAttachment({
      $,
      portalId: this.portalId,
      data: form,
      headers: form.getHeaders(),
    });
    const id = attachment[0].attachment_id;

    const form2 = new FormData();
    form2.append("attachment_ids", JSON.stringify([
      id,
    ]));

    const response = await this.zohoBugtracker.addAttachmentToIssue({
      $,
      portalId: this.portalId,
      projectId: this.projectId,
      bugId: this.bugId,
      data: form2,
      headers: form2.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded attachment to bug ${this.bugId}`);
    return response;
  },
};
