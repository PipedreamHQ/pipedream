import common from "../common/common-webhook.mjs";
import constants from "../common/constants.mjs";
import github from "../../github.app.mjs";

export default {
  ...common,
  key: "github-weebhook-vents",
  name: "New Webhook Event (Instant)",
  description: "Emit new event for each selected event types",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    repoFullname: {
      label: "Repository",
      description: "The name of the repository. The name is not case sensitive",
      type: "string",
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    events: {
      label: "Webhook Events",
      description: "The event will be emitted",
      type: "string[]",
      options: constants.REPOSITORY_WEBHOOK_EVENTS.map(({
        value, label,
      }) => ({
        value,
        label,
      })),
      reloadProps: true,
    },
  },
  async additionalProps() {
    console.log("additionalProps loaded", this.events[0]);
    const props = {};
    // if (this.events[0] === "package") {
    props.packageType = {
      label: "Package type",
      description: "The type of supported package",
      type: "string",
      options: constants.PACKAGE_TYPE,
    };
    props.orgName = {
      propDefinition: [
        github,
        "orgName",
      ],
      optional: true,
    };
    // }
    return props;
  },
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return this.events;
    },
    async loadHistoricalData() {
      const func = constants
        .REPOSITORY_WEBHOOK_EVENTS
        .find((item) => this.events[0] === item.value);
      console.log("this.orgName", this.orgName);
      if (func?.fnName) {
        const data = await this["github"][func.fnName]({
          repoFullname: this.repoFullname,
          orgName: this.orgName,
          data: {
            per_page: 25,
            page: 1,
            package_type: this.packageType,
          },
        });
        console.log("data", data);
        const ts = new Date().getTime();
        if (data) {
          return data.map((event) => ({
            main: event,
            sub: {
              id: event?.id || event?.name || ts,
              summary: `New event of type ${constants.REPOSITORY_WEBHOOK_EVENTS.find((item) => this.events[0] === item.value).label}`,
              ts,
            },
          }));
        }
      }

    },
  },
  async run(event) {
    const {
      headers,
      body,
    } = event;

    this.$emit(body, {
      id: headers["x-github-delivery"],
      summary: `New event ${headers["x-github-hook-installation-target-id"]} of type ${headers["x-github-hook-installation-target-type"]}}`,
      ts: new Date(),
    });
  },
};
