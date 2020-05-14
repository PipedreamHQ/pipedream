const typeform = require('https://github.com/PipedreamHQ/pipedream/components/typeform/typeform.app.js')

module.exports = {
  name: "new-submission", 
  version: "0.0.1",
  props: {
    http: "$.interface.http",
    typeform,
    formId: { propDefinition: [typeform, "formId"] },
  },
  hooks: {
    async activate() {
      return (await this.typeform.createHook({
        endpoint: this.http.endpoint,
        formId: this.formId,
      }))
    },
    async deactivate() {
      return (await this.jotform.deleteHook({
        endpoint: this.http.endpoint,
        formId: this.formId,
      }))
    },
  },
  async run(event) { 
    this.http.respond({
      status: 200,
    })
    this.$emit(event.body, {
      summary: event.body.event_type,
      id: event.body.event_id,
    })
  },
}