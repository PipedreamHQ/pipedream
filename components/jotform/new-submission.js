const jotform = require('https://github.com/PipedreamHQ/pipedream/components/jotform/jotform.app.js')
const busboy = require('busboy')

module.exports = {
  name: "new-submission", 
  version: "0.0.1",
  props: {
    db: "$.service.db", 
    http: "$.interface.http",
    jotform,
    formId: { propDefinition: [jotform, "formId"] },
  },
  hooks: {
    async activate() {
      const response = await this.jotform.createHook({
        apiKey: this.jotform.$auth.api_key,
        endpoint: this.http.endpoint,
        formId: this.formId,
      })
      this.db.set("hookId", response.content.length - 1)
    },
    async deactivate() {
      await this.jotform.deleteHook({
        apiKey: this.jotform.$auth.api_key,
        hookId: this.http.endpoint,
        formId: this.formId,
      })
    },
  },
  async run(event) {
    console.log(event)
    const objArray = []
    const bb = new busboy({ headers: event.headers });
    let fileData = {}
    let formData = {}

    await new Promise((resolve, reject) => {
      bb.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File [%s]: filename=%j; encoding=%j; mimetype=%j', fieldname, filename, encoding, mimetype);
        fileData.file = filename
        fileData.fileName = filename
        fileData.encoding = encoding
        fileData.mimetype = mimetype
        fileData.data = {}
        
        file
        .on('data', data => {
          fileData.data[fieldname] = data.length
        })
      }).on('field', (fieldname, val) => {
        try {
          formData[fieldname] = JSON.parse(val)
        } catch (err) {
          formData[fieldname] = val
        }
      })
      .on("finish", resolve)
      .on('error', err => { throw err })
      bb.end(event.body)
    })

    // fileData
    // formData
    this.$emit(formData, {
      summary: JSON.stringify(formData.rawRequest) || JSON.stringify(formData),
      id: formData.submissionID,
    })
  },
}