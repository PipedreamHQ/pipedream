const typeform = require('https://github.com/PipedreamHQ/pipedream/components/typeform/typeform.app.js')
const { uuid } = require("uuidv4")

module.exports = {
  name: "new-submission", 
  version: "0.0.1",
  props: {
    db: "$.service.db",
    http: "$.interface.http",
    typeform,
    formId: { propDefinition: [typeform, "formId"] },
  },
  hooks: {
    async activate() {
      let tag = this.db.get('tag')
      if(!tag){
        tag = uuid()
        this.db.set('tag', tag)
      }
      return (await this.typeform.createHook({
        endpoint: this.http.endpoint,
        formId: this.formId,
        tag,
      }))
    },
    async deactivate() {
      return (await this.typeform.deleteHook({
        formId: this.formId,
        tag: this.db.get('tag'),
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