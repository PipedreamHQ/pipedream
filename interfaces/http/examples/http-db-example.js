// Example of how to use $.service.db methods
// Each time this component receives an HTTP request,
// it increments the requestCount key and emits it
module.exports = {
  name: 'http-db',
  version: '0.0.2',
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: '$.service.db',
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: event,
    });
    let requestCount = this.db.get('requestCount') || 0;
    requestCount += 1;
    this.$emit({requestCount});
    this.db.set('requestCount', requestCount);
  },
};
