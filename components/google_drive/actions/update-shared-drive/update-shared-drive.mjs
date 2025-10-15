import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-update-shared-drive",
  name: "Update Shared Drive",
  description: "Update an existing shared drive. [See the documentation](https://developers.google.com/drive/api/v3/reference/drives/update) for more information",
  version: "0.1.14",
  annotations: {
    destructiveHint: true,
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
      description:
        "Select a [shared drive](https://support.google.com/a/users/answer/9310351) to update",
      default: "",
      optional: false,
    },
    useDomainAdminAccess: {
      propDefinition: [
        googleDrive,
        "useDomainAdminAccess",
      ],
    },
    themeId: {
      propDefinition: [
        googleDrive,
        "themeId",
      ],
    },
    backgroundImageLink: {
      type: "string",
      label: "Background Image Link",
      description:
        "A link to the new background image for the shared drive. Cannot be set if `Theme ID` is used (it already sets the background image).",
      optional: true,
    },
    colorRgb: {
      type: "string",
      label: "Color",
      description:
        "The new color of this shared drive as an RGB hex string. Cannot be set if `Theme ID` is used (it already sets the color).",
      optional: true,
    },
    restrictions: {
      type: "object",
      label: "Restrictions",
      description:
        "A set of restrictions that apply to this shared drive or items inside this shared drive. See `restrictions` in the [Drive resource representation](https://developers.google.com/drive/api/v3/reference/drives#resource-representations).",
      optional: true,
      default: {},
    },
  },
  async run({ $ }) {
    const {
      useDomainAdminAccess,
      backgroundImageLink,
      colorRgb,
      themeId,
      restrictions,
    } = this;
    const driveId = this.googleDrive.getDriveId(this.drive);
    const resp = await this.googleDrive.updateSharedDrive(driveId, {
      useDomainAdminAccess,
      requestBody: {
        backgroundImageLink,
        colorRgb,
        themeId,
        restrictions,
      },
    });
    $.export("$summary", `Successfully updated the shared drive, "${resp.name}"`);
    return resp;
  },
};
