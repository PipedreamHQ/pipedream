import { NodeSSH } from "node-ssh";

export default {
  type: "app",
  app: "ssh",
  propDefinitions: {},
  methods: {
    _accessPort() {
      return this.$auth.port;
    },
    _accessHost() {
      return this.$auth.host;
    },
    _accessUsername() {
      return this.$auth.username;
    },
    _accessPrivateKey() {
      return this.$auth.privateKey;
    },
    async _createClient() {
      const client = new NodeSSH();

      await client.connect({
        host: this._accessHost(),
        port: this._accessPort(),
        username: this._accessUsername(),
        privateKey: this._accessPrivateKey(),
      });

      return client;
    },
    async executeCommand({ command }) {
      const client = await this._createClient();

      const response = await new Promise((resolve) => {
        client.execCommand(command).then(function (result) {
          return resolve(result);
        });
      });

      await client.dispose();

      return response;
    },
  },
};
