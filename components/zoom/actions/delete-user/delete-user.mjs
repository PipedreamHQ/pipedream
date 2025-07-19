import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-delete-user",
  name: "Delete User",
  description: "Disassociates (unlinks) a user from the associated account or permanently deletes a user. Requires a paid Zoom account. [See the documentation](https://developers.zoom.us/docs/api/users/#tag/users/DELETE/users/{userId})",
  version: "0.2.5",
  type: "action",
  props: {
    zoom,
    paidAccountAlert: {
      propDefinition: [
        zoom,
        "paidAccountAlert",
      ],
    },
    userId: {
      propDefinition: [
        zoom,
        "userId",
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "Delete action options:<br>`disassociate` - Disassociate a user.<br>`delete`-  Permanently delete a user.<br>Note: To delete pending user in the account, use `disassociate`",
      optional: true,
      options: [
        "disassociate",
        "delete",
      ],
    },
    transferEmail: {
      type: "string",
      label: "Transfer Email",
      description: "Transfer email. This field is required if the user has Zoom Events/Sessions feature. After you delete or disassociate the user, the user's hub assets on Zoom Events site will be transferred to the target user.",
      optional: true,
    },
    transferMeeting: {
      type: "boolean",
      label: "Transfer Meeting",
      description: "Transfer meeting.",
      optional: true,
    },
    transferWebinar: {
      type: "boolean",
      label: "Transfer Webinar",
      description: "Transfer webinar.",
      optional: true,
    },
    transferRecording: {
      type: "boolean",
      label: "Transfer Recording",
      description: "Transfer recording.",
      optional: true,
    },
  },
  methods: {
    deleteUser({
      userId, ...args
    }) {
      return this.zoom.delete({
        path: `/users/${userId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.deleteUser({
      $,
      userId: this.userId,
      data: {
        action: this.action,
        transfer_email: this.transferEmail,
        transfer_meeting: this.transferMeeting,
        transfer_webinar: this.transferWebinar,
        transfer_recording: this.transferRecording,
      },
    });
    $.export("$summary", `Successfully deleted user: \`${this.userId}\``);
    return response;
  },
};
