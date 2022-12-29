import SFTPClient from "ssh2-sftp-client";

export default {
  type: "app",
  app: "sftp",
  methods: {
    getOptions(_privateKey) {
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
        privateKey: _privateKey || privateKey,
        debug: console.log,
      };
    },
    async connect(privateKey) {
      const client = new SFTPClient();
      try {
        await client.connect(this.getOptions(privateKey));
      } catch (error) {
        console.log("Connection error", error);
        throw error;
      }
      return client;
    },
    async execCmd({
      privateKey, cmd, args = [],
    }) {
      const client = await this.connect(privateKey);

      try {
        return await client[cmd](...args);

      } catch (error) {
        console.log("CMD error", error);
        throw error;

      } finally {
        await client.end();
      }
    },
  },
};
