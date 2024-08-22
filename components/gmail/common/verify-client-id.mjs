import gmail from "../gmail.app.mjs";

const restrictedClientId = "38931588176-fnd4m13k1mjb6djallp1m9kr7o8kslcu.apps.googleusercontent.com";
const errorMessage = "You must use a custom OAuth client to use this component. Please see [here](https://pipedream.com/docs/connected-accounts/oauth-clients) for more details.";

export default {
  props: {
    gmail: {
      ...gmail,
    // Uncomment the line below to add client ID verification
    // reloadProps: true,
    },
    appAlert: {
      type: "alert",
      content: "",
      hidden: true,
    },
  },
  async additionalProps(props) {
    const isValidClientId = await this.checkClientId();
    props.appAlert.alertType = isValidClientId
      ? "info"
      : "error";
    props.appAlert.content = isValidClientId
      ? "OAuth client ID is valid. You can use the component."
      : errorMessage;
    props.appAlert.hidden = false;
    return {};
  },
  methods: {
    async checkClientId() {
      return this.gmail.$auth.oauth_client_id !== restrictedClientId;
    },
  },
};
