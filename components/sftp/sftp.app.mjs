import SFTPClient from "ssh2-sftp-client";

export default {
  type: "app",
  app: "sftp",
  methods: {
    getOptions() {
      const {
        host,
        port,
        username,
        privateKey,
      } = this.$auth;
      return {
        host,
        port,
        username,
        privateKey,
        debug: console.log,
      };
    },
    async connect() {
      const client = new SFTPClient();
      try {
        await client.connect(this.getOptions());
      } catch (error) {
        console.log("Connection error", error);
        throw error;
      }
      return client;
    },
    async execCmd({
      cmd, args = [],
    }) {
      const client = await this.connect();

      try {
        return await client[cmd](...args);

      } catch (error) {
        console.log("PUT error", error);
        throw error;

      } finally {
        await client.end();
      }
    },
  },
};
