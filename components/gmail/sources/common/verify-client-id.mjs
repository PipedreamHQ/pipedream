const restrictedClientId = "38931588176-fnd4m13k1mjb6djallp1m9kr7o8kslcu.apps.googleusercontent.com";

export default {
  methods: {
    async checkClientId() {
      return this.gmail.$auth.oauth_client_id !== restrictedClientId;
    },
  },
};
