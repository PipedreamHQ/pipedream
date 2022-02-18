// legacy_hash_id: a_JmiRq3
import fs from "fs";
import FormData from "form-data";
import { axios } from "@pipedream/platform";

export default {
  key: "jira-add-attachment-to-issue",
  name: "Add Attachment To Issue",
  description: "Adds an attachment to an issue.",
  version: "0.2.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    filename: {
      type: "string",
      description: "Name of the file to add as an attachment. Must exist in the related workflow's `/tmp` folder.",
    },
    issueIdOrKey: {
      type: "string",
      description: "The ID or key of the issue where the attachment will be added to.",
    },
  },
  async run({ $ }) {
    // First we must make a request to get our the cloud instance ID tied
    // to our connected account, which allows us to construct the correct REST API URL. See Section 3.2 of
    // https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/
    const resp = await axios($, {
      url: "https://api.atlassian.com/oauth/token/accessible-resources",
      headers: {
        Authorization: `Bearer ${this.jira.$auth.oauth_access_token}`,
      },
    });

    // Assumes the access token has access to a single instance
    const cloudId = resp[0].id;

    const data = new FormData();
    const file = fs.createReadStream(`/tmp/${this.filename}`);
    data.append("file", file);

    return await axios($, {
      method: "post",
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${this.issueIdOrKey}/attachments`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        "X-Atlassian-Token": "no-check",
      },
      data,
    });
  },
};
