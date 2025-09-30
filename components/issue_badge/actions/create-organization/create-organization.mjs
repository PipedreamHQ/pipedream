import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import issueBadge from "../../issue_badge.app.mjs";

export default {
  key: "issue_badge-create-organization",
  name: "Create Organization",
  description: "Create a new organization [See the documentation](https://documenter.getpostman.com/view/19911979/2sA2r9X4Aj#9f046aa2-e975-420f-a9ec-3274ea74c6bd)",
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
      label: "Organization Name",
      description: "The name of the organization",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the organization",
    },
    badgeLogo: {
      type: "string",
      label: "Badge Logo",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.png`)",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment for the organization",
      optional: true,
    },
  },
  async run({ $ }) {
    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("description", this.description);
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

    const response = await this.issueBadge.createOrganization({
      $,
      data: formData,
      headers: formData.getHeaders(),
    });

    $.export("$summary", `Successfully created organization with ID: ${response.data.uu_id.id}`);
    return response;
  },
};
