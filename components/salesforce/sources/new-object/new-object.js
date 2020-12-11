const startCase = require('lodash/startCase');

const common = require('../../common');

module.exports = {
  ...common,
  name: 'New Object (of Selectable Type)',
  key: 'salesforce-new-object',
  description: `
    Emit an event (at regular intervals) when an object of arbitrary type
    (selected as an input parameter by the user) is created
  `,
  version: '0.0.3',
  methods: {
    ...common.methods,
    isItemRelevant(item, startTimestamp, endTimestamp) {
      const startDate = Date.parse(startTimestamp);
      const endDate = Date.parse(endTimestamp);
      const createdDate = Date.parse(item.CreatedDate);
      return startDate <= createdDate && endDate >= createdDate;
    },
    generateMeta(item) {
      const nameField = this.db.get('nameField');
      const {CreatedDate: createdDate, Id: id, [nameField]: name} = item;
      const entityType = startCase(this.objectType);
      const summary = `New ${entityType} created: ${name}`;
      const ts = Date.parse(createdDate);
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(eventData) {
      const {startTimestamp, endTimestamp} = eventData;
      const {
        ids,
        latestDateCovered,
      } = await this.salesforce.getUpdatedForObjectType(
        this.objectType,
        startTimestamp,
        endTimestamp,
      );

      // By the time we try to retrieve an item, it might've been deleted. This
      // will cause `getSObject` to throw a 404 exception, which will reject its
      // promise. Hence, we need to filter those items that we still in Salesforce
      // and exclude those that are not.
      const itemRetrievals = await Promise.allSettled(
        ids.map(id => this.salesforce.getSObject(this.objectType, id)),
      );
      itemRetrievals
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(item => this.isItemRelevant(item, startTimestamp, endTimestamp))
        .forEach(item => {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
        });

      this.db.set('latestDateCovered', latestDateCovered);
    },
  },
};
