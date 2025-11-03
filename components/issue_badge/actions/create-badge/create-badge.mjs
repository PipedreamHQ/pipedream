import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import issueBadge from "../../issue_badge.app.mjs";

export default {
  key: "issue_badge-create-badge",
  name: "Create Badge",
  description: "Create a new badge [See the documentation](https://documenter.getpostman.com/view/19911979/2sA2r9X4Aj#2d909087-86e3-4e78-82ce-7b1691285a20)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    issueBadge,
    name: {
      type: "string",
      label: "Badge Name",
      description: "The name of the badge",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the badge",
    },
    badgeLogo: {
      type: "string",
      label: "Badge Logo",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.png`)",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment for the badge",
      optional: true,
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    if (this.name) formData.append("name", this.name);
    if (this.description) formData.append("description", this.description);
    if (this.comment) formData.append("comment", this.comment);

    if (this.badgeLogo) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.badgeLogo);
      formData.append("badge_logo", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }

    const result = await this.issueBadge.createBadge({
      $,
      data: formData,
      headers: formData.getHeaders(),
    });

    $.export("$summary", `Successfully created badge with ID: ${result.badgeId}`);
    return result;
  },
};
