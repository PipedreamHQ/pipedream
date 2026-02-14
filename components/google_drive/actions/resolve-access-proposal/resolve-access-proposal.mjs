import { ConfigurationError } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-resolve-access-proposal",
  name: "Resolve Access Proposals",
  description: "Accept or deny a request for access to a file or folder in Google Drive. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/accessproposals/resolve)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
    },
    fileOrFolderId: {
      propDefinition: [
        googleDrive,
        "fileOrFolderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
    },
    accessProposalId: {
      propDefinition: [
        googleDrive,
        "accessProposalId",
        (c) => ({
          fileId: c.fileOrFolderId,
        }),
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "The action to take on the AccessProposal",
      options: [
        "ACCEPT",
        "DENY",
      ],
    },
    roles: {
      type: "string[]",
      label: "Roles",
      description: "The roles to allow. Note: This field is required for the `ACCEPT` action.",
      options: [
        "writer",
        "commenter",
        "reader",
      ],
      optional: true,
    },
    sendNotification: {
      type: "boolean",
      label: "Send Notification",
      description: "Whether to send an email to the requester when the AccessProposal is denied or accepted",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.action === "ACCEPT" && !this.roles?.length) {
      throw new ConfigurationError("A Role is required for the `ACCEPT` action");
    }

    const response = await this.googleDrive.resolveAccessProposal({
      fileId: this.fileOrFolderId,
      proposalId: this.accessProposalId,
      action: this.action,
      role: this.roles,
      sendNotification: this.sendNotification,
    });

    $.export("$summary", `Successfully resolved proposal with ID: ${this.accessProposalId}`);
    return response;
  },
};
