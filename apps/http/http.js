module.exports = {
  name: 'http',
  version: '0.0.1',
  props: {
    http: '$.interface.http',
  },
  events: {
    async default(event) {
      this.http.respond({
        status: 200,
        body: {
          success: true,
        },
      });
      // Emit the whole event, which contains
      // the HTTP payload, headers, and more
      try {
        event.body = JSON.parse(event.body)
      } catch (err) {
        // no op
      }
      this.$emit(event)
    },
  },
};
