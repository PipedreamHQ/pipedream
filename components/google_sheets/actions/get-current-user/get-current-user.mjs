import googleSheets from "../../google_sheets.app.mjs";

const ABOUT_FIELDS = "user,storageQuota";

export default {
  key: "google_sheets-get-current-user",
  name: "Get Current User",
  description: "Retrieve Google Sheets account metadata for the authenticated user by calling Drive's `about.get`, returning the user profile (display name, email, permission ID) and storage quota information. Helpful when you need to verify which Google account is active, tailor sheet operations to available storage, or give an LLM clear context about the user identity before composing read/write actions. [See the Drive API documentation](https://developers.google.com/drive/api/v3/reference/about/get).",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleSheets,
  },
  async run({ $ }) {
    const about = await this.googleSheets.getAbout(ABOUT_FIELDS);

    const summaryName =
      about?.user?.displayName
      || about?.user?.emailAddress
      || about?.user?.permissionId;
    $.export("$summary", `Retrieved Google Sheets user ${summaryName}`);

    return {
      about,
    };
  },
};
