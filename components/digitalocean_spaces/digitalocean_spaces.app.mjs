export default {
  type: "app",
  app: "digitalocean_spaces",
  methods: {
    getAWSClient(clientType) {
      this.region = this.$auth.region; // sets this so it is accessible by app and methods
      return new clientType({
        forcePathStyle: false, // Configures to use subdomain/virtual calling format.
        endpoint: `https://${this.region}.digitaloceanspaces.com`,
        region: this.region,
        credentials: {
          accessKeyId: this.$auth.key,
          secretAccessKey: this.$auth.secret,
        },
      });
    },
  },
};
