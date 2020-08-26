const typeform = require('https://github.com/PipedreamHQ/pipedream/components/typeform/typeform.app.js')
const { uuid } = require("uuidv4")

module.exports = {
  name: "New Submission", 
  version: "0.0.1",
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
      if(!tag){
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
    this.http.respond({
      status: 200,
    })

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

    this.$emit(body, {
      summary: JSON.stringify(body),
      id: body.event_id,
    })
  },
}