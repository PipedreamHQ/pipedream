import app from "../../orbit.app.mjs";

export default {
  name: "Get Member by Identity",
  description: "Provide a source and one of username/uid/email params to return a member with that identity, if one exists. Common values for source include github, twitter, and email. [See the docs here](https://api.orbit.love/reference/get_workspace-slug-members-find)",
  key: "orbit-get-member-by-identity",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    workspaceSlug: {
      propDefinition: [
        app,
        "workspaceSlug",
      ],
    },
    activityTypes: {
      propDefinition: [
        app,
        "activityType",
        (c) => ({
          workspaceSlug: c.workspaceSlug,
        }),
      ],
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the identity.",
      optional: true,
    },
    sourceHost: {
      type: "string",
      label: "Source Host",
      description: "The host of the source.",
      optional: true,
    },
    uid: {
      type: "string",
      label: "UID",
      description: "The UID of the identity.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the identity.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the identity.",
      optional: true,
    },
  },
  async run({ $ }) {
    const query = {
      source: this.source,
      source_host: this.sourceHost,
      uid: this.uid,
      username: this.username,
      email: this.email,
    };
    const res = await this.app.getMemberByIdentity(
      this.workspaceSlug,
      query,
    );
    $.export("$summary", `Member successfully fetched with id "${res.data.id}"`);
    return res;
  },
};
