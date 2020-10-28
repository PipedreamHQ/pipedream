const jotform = require('../../jotform.app.js')

module.exports = {
  key: "jotform-new-submission",
  name: "New Submission (Instant)",
  description: "Emit an event when a new form is submitted",
  version: "0.0.2",
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
    event.body.formData = JSON.parse(event.body.rawRequest)

    this.$emit(event.body, {
      summary: event.body.rawRequest || JSON.stringify(event.body),
      id: event.body.submissionID,
    })
  },
}
