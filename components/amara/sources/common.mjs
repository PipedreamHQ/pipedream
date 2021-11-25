import amara from "../amara.app.mjs";
import constants from "../constants.mjs";

export default {
  props: {
    amara,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Amara API",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    team: {
      description: "The team slug of the team to watch",
      optional: true,
      propDefinition: [
        amara,
        "team",
      ],
    },
  },
  methods: {
    setLastUrl(lastUrl) {
      this.db.set(constants.LAST_URL, lastUrl);
    },
    getLastUrl() {
      return this.db.get(constants.LAST_URL);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFn is not implemented");
    },
    getAllowedEvents() {
      throw new Error("getAllowedEvents is not implemented");
    },
    /**
     * For Team notifications returns resource.data.event and
     * resource.data.number as the identifier.
     *  - For response data look at the docs [here](https://apidocs.amara.org/#list-team-notifications)
     * For Team activity returns resource.type and resource.video as the identifier.
     *  - For response data look at the docs [here](https://apidocs.amara.org/#team-activity)
     * @param {object} resource
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
    generateMeta(resource) {
      const [
        eventType,
        eventId,
      ] = this.getEventTypeAndId(resource);
      return {
        id: JSON.stringify(resource),
        summary: `${eventId} ${eventType}`,
        ts: Date.now(),
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
      if (this.isRelevant(resource)) {
        const meta = this.generateMeta(resource);
        this.$emit(resource, meta);
      }
    },
  },
  async run({ $ }) {
    const url = this.getLastUrl();

    const { lastUrl } = await this.amara.paginateResources({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs({
        $,
        url,
      }),
      limit: 40,
      callback: this.processEvent,
    });

    this.setLastUrl(lastUrl);
  },
};
