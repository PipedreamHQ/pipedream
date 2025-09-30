// legacy_hash_id: a_poikQ1
import { axios } from "@pipedream/platform";

export default {
  key: "zoom-create-user",
  name: "Create User",
  description: "Creates a new user in your account.",
  version: "0.2.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zoom: {
      type: "app",
      app: "zoom",
    },
    action: {
      type: "string",
      description: "Specify how to create the new user: <br>`create` - User will get an email sent from Zoom. There is a confirmation link in this email. The user will then need to use the link to activate their Zoom account. The user can then set or change their password.<br>`autoCreate` - This action is provided for the enterprise customer who has a managed domain. This feature is disabled by default because of the security risk involved in creating a user who does not belong to your domain.<br>`custCreate` - Users created via this option do not have passwords and will not have the ability to log into the Zoom Web Portal or the Zoom Client. To use this option, you must contact the ISV Platform Sales team at isv@zoom.us.<br>`ssoCreate` - This action is provided for the enabled Pre-provisioning SSO User option. A user created in this way has no password. If not a basic user, a personal vanity URL using the user name (no domain) of the provisioning email will be generated. If the user name or PMI is invalid or occupied, it will use a random number or random personal vanity URL.",
      options: [
        "create",
        "autoCreate",
        "custCreate",
        "ssoCreate",
      ],
    },
    user_info: {
      type: "object",
      description: "Object with the user information. It has the following properties:\nemail: User email address\ntype: User type:<br>`1` - Basic.<br>`2` - Licensed.<br>`3` - On-prem.\nfirst_name: User's first name: cannot contain more than 5 Chinese words.\nlast_name: User's last name: cannot contain more than 5 Chinese words.\npassword: User password. Only used for the \\\"autoCreate\\\" function. The password has to have a minimum of 8 characters and maximum of 32 characters. It must have at least one letter (a, b, c..), at least one number (1, 2, 3...) and include both uppercase and lowercase letters. It should not contain only one identical character repeatedly ('11111111' or 'aaaaaaaa') and it cannot contain consecutive characters ('12345678' or 'abcdefgh').",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://marketplace.zoom.us/docs/api-reference/zoom-api/users/usercreate
    const config = {
      method: "post",
      url: "https://api.zoom.us/v2/users",
      data: {
        action: this.action,
        user_info: typeof this.user_info == "undefined"
          ? this.user_info
          : JSON.parse(this.user_info),
      },
      headers: {
        "Authorization": `Bearer ${this.zoom.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      },
    };
    return await axios($, config);
  },
};
