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
      description: "The team slug of the team to watch. Passing in `null` or empty will return only resources that are in the public area.",
      optional: true,
      propDefinition: [
        amara,
        "team",
      ],
    },
  },
  hooks: {
    async deploy() {
      const [
        resource,
      ] = await this.amara.paginateResources({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
        callback: this.processEvent,
        max: constants.DEFAULT_MAX_ITEMS,
      });
      this.setLastResourceStr(resource);
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
      if (this.isRelevant(resource)) {
        const meta = this.generateMeta(resource);
        this.$emit(resource, meta);
      }
    },
  },
  async run({ $ }) {
    const lastResourceStr = this.getLastResourceStr();

    const [
      resource,
    ] = await this.amara.paginateResources({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs({
        $,
      }),
      callback: this.processEvent,
      lastResourceStr,
    });

    if (resource) {
      this.setLastResourceStr(resource);
    }
  },
};
