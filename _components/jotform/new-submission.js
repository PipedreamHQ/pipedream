const jotform = require('https://github.com/PipedreamHQ/pipedream/components/jotform/jotform.app.js')

module.exports = {
  name: "new-submission", 
  version: "0.0.1",
  props: {
    jotform,
    formId: { propDefinition: [jotform, "formId"] },
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      return (await this.jotform.createHook({
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

    event.body.formData = JSON.parse(event.body.rawRequest)
    
    this.$emit(event.body, {
      summary: event.body.rawRequest || JSON.stringify(event.body),
      id: event.body.submissionID,
    })
  },
}