import mural from "../../mural.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "mural-invite-to-mural",
  name: "Invite to Mural",
  description: "Share a mural by inviting a user to it. Supply either **Email** or **Username**: an email invitation must be accepted by the recipient before they gain access, while inviting by username adds the user to the mural immediately. Users invited to a mural without being members of its room become restricted members, meaning they can open only that mural and cannot create murals in the room. [See the documentation](https://developers.mural.co/public/reference/inviteuserstomural)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mural,
    workspaceId: {
      propDefinition: [
        mural,
        "workspaceId",
      ],
    },
    muralId: {
      propDefinition: [
        mural,
        "muralId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user to invite",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the user to invite. When inviting by username, the user is immediately added to the mural.",
      optional: true,
    },
    editPermission: {
      type: "string",
      label: "Edit Permission",
      description: "The level of access granted to the invited user. Use `edit` (the default) to let them add and change widgets, as you would for a collaborator contributing to a workshop. Use `view` for read-only access, as you would when sharing results with a stakeholder who should not alter the mural.",
      options: [
        "view",
        "edit",
      ],
      default: "edit",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The custom message to be sent in the email invitation",
      optional: true,
    },
    sendEmail: {
      type: "boolean",
      label: "Send Email",
      description: "Indicates if the invitation will or will not be emailed. Default value is `true`.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    if (!this.email && !this.username) {
      throw new ConfigurationError("Either Email or Username must be provided.");
    }

    const invitation = {
      editPermission: this.editPermission,
    };
    if (this.email) {
      invitation.email = this.email;
    }
    if (this.username) {
      invitation.username = this.username;
    }

    const data = {
      invitations: [
        invitation,
      ],
    };

    if (this.message) {
      data.message = this.message;
    }
    if (this.sendEmail !== undefined) {
      data.sendEmail = this.sendEmail;
    }

    const response = await this.mural.inviteToMural({
      $,
      muralId: this.muralId,
      data,
    });

    const invitee = this.email || this.username;
    $.export("$summary", `Successfully invited ${invitee} to mural`);
    return response;
  },
};
