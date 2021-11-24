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
    /**
     * For Team notifications returns resource.data.event and
     * resource.data.number as the identifier.
     *  - For response data look at the docs [here](https://apidocs.amara.org/#list-team-notifications)
     * For Team activity returns resource.type and resource.video as the identifier.
     *  - For response data look at the docs [here](https://apidocs.amara.org/#team-activity)
     * @param {object} resource
     * @returns {Array}
     */
    getEventIdAndType(resource) {
      if (resource.data) {
        return [
          resource.data.event,
          resource.data.number,
        ];
      }
      return [
        resource.type,
        resource.video,
      ];
    },
    getMetadata(resource) {
      const [
        eventType,
        eventId,
      ] = this.getEventIdAndType(resource);
      return {
        id: JSON.stringify(resource),
        summary: `${eventId} ${eventType}`,
        ts: Date.now(),
      };
    },
    buildCallback (allowedEvents) {
      return (resource) => {
        const [
          eventType,
        ] = this.getEventIdAndType(resource);

        if (allowedEvents.includes(eventType)) {
          this.$emit(resource, this.getMetadata(resource));
        }
      };
    },
    async emitEvents({
      resourceFn,
      resourceFnArgs,
      allowedEvents = [],
    }) {
      const url = this.getLastUrl();

      const { lastUrl } = await this.amara.paginateResources({
        resourceFn,
        resourceFnArgs: {
          ...resourceFnArgs,
          url,
        },
        limit: 40,
        callback: this.buildCallback(allowedEvents),
      });

      this.setLastUrl(lastUrl);
    },
  },
};
