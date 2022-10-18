import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-update-shared-drive",
  name: "Update Shared Drive",
  description: "Update an existing shared drive. [See the docs](https://developers.google.com/drive/api/v3/reference/drives/update) for more information",
  version: "0.0.4",
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
    },
    useDomainAdminAccess: {
      propDefinition: [
        googleDrive,
        "useDomainAdminAccess",
      ],
    },
    backgroundImageLink: {
      type: "string",
      label: "Background Image Link",
      description:
        "A link to the new background image for the shared drive. Cannot be set if `Theme ID` is set in the same request.",
      optional: true,
    },
    colorRgb: {
      type: "string",
      label: "Color",
      description:
        "The new color of this shared drive as an RGB hex string. Cannot be set if `Theme ID` is set in the same request.",
      optional: true,
    },
    themeId: {
      type: "string",
      label: "Theme ID",
      description:
        "The ID of the theme from which the background image and color will be set. Cannot be set if `Color` or `Background Image Link` is set in the same request.",
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
