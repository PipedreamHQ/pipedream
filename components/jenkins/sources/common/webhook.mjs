import { ConfigurationError } from "@pipedream/platform";
import app from "../../jenkins.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Rmember to install the Jenkins Notification Plugin to use this source. Also make sure to activate and enable it in the job configuration.",
    },
    jobName: {
      propDefinition: [
        app,
        "jobName",
      ],
    },
  },
  hooks: {
    async deploy() {
      const {
        listPlugins,
        setPluginVersion,
      } = this;

      const { plugins } = await listPlugins({
        params: {
          depth: 1,
          tree: "plugins[active,enabled,shortName,longName,version]",
        },
      });
      const plugin = plugins.find(({ shortName }) => shortName === "notification");
      if (!plugin) {
        throw new ConfigurationError("The Jenkins Notification Plugin is not installed. Please install it to use this source.");
      }
      if (!plugin.active) {
        throw new ConfigurationError("The Jenkins Notification Plugin is not active. Please activate it to use this source.");
      }
      if (!plugin.enabled) {
        throw new ConfigurationError("The Jenkins Notification Plugin is not enabled. Please enable it to use this source.");
      }

      setPluginVersion(plugin.version);
    },
    async activate() {
      const {
        http: { endpoint: url },
        jobName,
        getConfig,
        updateConfig,
        getEventName,
        getPluginVersion,
      } = this;

      const { project } = await getConfig({
        jobName,
      });

      const { properties } = project;

      await updateConfig({
        jobName,
        data: {
          project: {
            ...project,
            properties: {
              ...properties,
              "com.tikal.hudson.plugins.notification.HudsonNotificationProperty": {
                "@_plugin": `notification@${getPluginVersion()}`,
                "endpoints": {
                  "com.tikal.hudson.plugins.notification.Endpoint": {
                    "protocol": "HTTP",
                    "format": "JSON",
                    "urlInfo": {
                      "urlOrId": url,
                      "urlType": "PUBLIC",
                    },
                    "event": getEventName(),
                    "timeout": 30000,
                    "loglines": 0,
                    "buildNotes": "",
                    "retries": 0,
                    "branch": ".*",
                  },
                },
              },
            },
          },
        },
      });
    },
    async deactivate() {
      const {
        jobName,
        getConfig,
        updateConfig,
      } = this;

      const { project } = await getConfig({
        jobName,
      });

      const {
        // eslint-disable-next-line no-unused-vars
        "com.tikal.hudson.plugins.notification.HudsonNotificationProperty": notificationProperty,
        ...properties
      } = project.properties;

      await updateConfig({
        jobName,
        data: {
          project: {
            ...project,
            properties,
          },
        },
      });
    },
  },
  methods: {
    setPluginVersion(value) {
      this.db.set(constants.PLUGIN_VERSION, value);
    },
    getPluginVersion() {
      return this.db.get(constants.PLUGIN_VERSION);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    listPlugins(args = {}) {
      return this.app._makeRequest({
        debug: true,
        path: "/pluginManager/api/json",
        ...args,
      });
    },
    getConfig({
      jobName, ...args
    } = {}) {
      return this.app._makeRequest({
        ...args,
        debug: true,
        path: `/job/${encodeURIComponent(jobName)}/config.xml`,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    },
    updateConfig({
      jobName, ...args
    } = {}) {
      return this.app.post({
        ...args,
        debug: true,
        path: `/job/${encodeURIComponent(jobName)}/config.xml`,
        headers: {
          "Content-Type": "text/xml",
        },
      });
    },
  },
  async run({ body }) {
    this.processResource(body);
  },
};
