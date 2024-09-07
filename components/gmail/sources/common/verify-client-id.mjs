import gmail from "../../gmail.app.mjs";

const restrictedClientId = "38931588176-fnd4m13k1mjb6djallp1m9kr7o8kslcu.apps.googleusercontent.com";

export default {
  props: {
    gmail: {
      ...gmail,
      reloadProps: true,
    },
    appAlert: {
      type: "alert",
      content: "",
      hidden: true,
    },
  },
  methods: {
    async checkClientId() {
      return this.gmail.$auth.oauth_client_id !== restrictedClientId;
    },
  },
};
