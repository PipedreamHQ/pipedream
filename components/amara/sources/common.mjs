import amara from "../amara.app.mjs";
import constants from "../common/constants.mjs";

export default {
  props: {
    amara,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Amara API",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    team: {
      description: "The team slug of the team to watch",
      optional: false,
      propDefinition: [
        amara,
        "team",
      ],
    },
  },
  hooks: {
    async deploy() {
      const resourcesStream = await this.amara.getResourcesStream({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
        max: constants.DEFAULT_MAX_ITEMS,
      });

      await this.processStreamEvents(resourcesStream);
    },
  },
  methods: {
    setLastResourceStr(resource) {
      this.db.set(constants.LAST_RESOURCE_STR, JSON.stringify(resource));
    },
    getLastResourceStr() {
      return this.db.get(constants.LAST_RESOURCE_STR);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs is not implemented");
    },
    getAllowedEvents() {
      throw new Error("getAllowedEvents is not implemented");
    },
    async processStreamEvents(resourcesStream) {
      let resources = [];
      for await (const resource of resourcesStream) {
        resources.push(resource);
      }

      const relevantResources = resources.filter(this.isRelevant);
      if (relevantResources.length === 0) {
        console.log("No new events detected. Skipping...");
        return;
      }

      relevantResources.reverse().forEach(this.processEvent);

      const lastResource = relevantResources.pop();
      this.setLastResourceStr(lastResource);
    },
    /**
     * For Team notifications returns resource.data.event and
     * resource.data.number as the identifier.
     *  - For response data look at the docs [here](https://apidocs.amara.org/#list-team-notifications)
     * For Team activity returns resource.type and resource.video as the identifier.
     *  - For response data look at the docs [here](https://apidocs.amara.org/#team-activity)
     * @param {Object} resource
     * @returns {Array}
     */
    getEventTypeAndId(resource) {
      if (resource.data) {
        return [
          resource.data.event,
          resource.data.number,
        ];
      }
      return [
        resource.type,
        resource.title || resource.video,
      ];
    },
    getSummary(resource) {
      const [
        eventType,
        eventId,
      ] = this.getEventTypeAndId(resource);
      return `${eventId} ${eventType}`;
    },
    generateMeta(resource) {
      return {
        id: JSON.stringify(resource),
        summary: this.getSummary(resource),
        ts: Date.parse(resource.date ?? resource.timestamp ?? new Date()),
      };
    },
    isRelevant(resource) {
      const [
        eventType,
      ] = this.getEventTypeAndId(resource);
      const allowedEvents = this.getAllowedEvents();
      return allowedEvents.includes(eventType);
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
  },
  async run({ $ }) {
    const lastResourceStr = this.getLastResourceStr();

    const resourcesStream = await this.amara.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs({
        $,
      }),
      lastResourceStr,
    });

    await this.processStreamEvents(resourcesStream);
  },
};
