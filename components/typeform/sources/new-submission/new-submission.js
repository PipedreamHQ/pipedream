const typeform = require('../../typeform.app.js')
const { uuid } = require("uuidv4")
const { DateTime } = require('luxon')

function parseIsoDate(isoDate) {
  return {
    isoDate,
    date_time: DateTime.fromISO(isoDate).toFormat('yyyy-mm-dd hh:mm:ss a'),
    date: DateTime.fromISO(isoDate).toFormat('yyyy-mm-dd'),
    time: DateTime.fromISO(isoDate).toFormat('hh:mm:ss a'),
    timezome: DateTime.fromISO(isoDate).zoneName,
    epoch: DateTime.fromISO(isoDate).toMillis()
  }
}

module.exports = {
  key: "typeform-new-submission",
  name: "New Submission",
  version: "0.0.2",
  props: {
    typeform,
    formId: { propDefinition: [typeform, "formId"] },
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    generateSecret() {
      return ""+Math.random()
    },
  },
  hooks: {
    async activate() {
      const secret = this.generateSecret()
      this.db.set('secret', secret)
      let tag = this.db.get('tag')
      if (!tag){
        tag = uuid()
        this.db.set('tag', tag)
      }
      return (await this.typeform.createHook({
        endpoint: this.http.endpoint,
        formId: this.formId,
        tag,
        secret,
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
    const { body, headers } = event

    if (headers["Typeform-Signature"]) {
      const crypto = require("crypto")
      const algo = "sha256"
      const hmac = crypto.createHmac(algo, this.db.get("secret"))
      hmac.update(body)
      if (headers["Typeform-Signature"] !== `${algo}=${hmac.digest("base64")}`) {
        throw new Error("signature mismatch")
      }
    }

    let form_response_string = ``
    const data = Object.assign({}, body.form_response)
    data.form_response_parsed = {}
    for (let i=0; i< body.form_response.answers.length; i++) {
      let answer
      let value = body.form_response.answers[i][body.form_response.answers[i].type]
      if (value.label) { answer = value.label } 
      else if (value.labels) { answer = value.labels.join() } 
      else if (value.choice) { answer = value.choice } 
      else if (value.choices) { answer = value.choices.join() } 
      else { answer = value }
      data.form_response_parsed[body.form_response.definition.fields[i].title] = answer
      form_response_string = `${form_response_string}### ${body.form_response.definition.fields[i].title}
${answer}
`
    }
    data.form_response_string = form_response_string
    data.raw_webhook_event = body
    if (data.answers) delete data.answers
    if (data.definition) delete data.definition
    if (data.landed_at) data.landed_at = parseIsoDate(data.landed_at)
    if (data.submitted_at) data.submitted_at = parseIsoDate(data.submitted_at)
    data.form_title = body.form_response.definition.title

    this.$emit(data, {
      summary: JSON.stringify(data),
      id: data.token,
    })
  },
}
