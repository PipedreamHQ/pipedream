import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-get-profile",
  name: "Get Profile",
  description: "Get the identity (display name and email) of the currently authenticated Google account. Use this to answer \"who am I\" questions and to attribute documents to the current user. Resolves via the Drive `about.get` endpoint (no extra OAuth scope required). [See the documentation](https://developers.google.com/drive/api/v3/reference/about/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDocs,
  },
  async run({ $ }) {
    const { user } = await this.googleDocs.getAbout("user");
    $.export("$summary", `Authenticated as ${user?.displayName || "unknown"} (${user?.emailAddress || "no email"})`);
    return user;
  },
};
