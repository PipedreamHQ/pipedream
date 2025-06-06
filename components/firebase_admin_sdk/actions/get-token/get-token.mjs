import firebase from "../../firebase_admin_sdk.app.mjs";

export default {
  key: "firebase_admin_sdk-get-token",
  name: "Get Token",
  description: "Retrieves the OAuth token from a Firestore admin account for API requests. [See the documentation](https://firebase.google.com/docs/admin/setup/#initialize_the_sdk_in_non-google_environments)",
  version: "0.0.1",
  type: "action",
  props: {
    firebase,
  },
  async run({ $ }) {
    const token = await this.firebase._getToken();
    $.export("$summary", "Succesfully retrieved OAuth token");
    return token;
  },
};
