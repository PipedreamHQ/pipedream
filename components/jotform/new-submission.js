const jotform = require('https://github.com/PipedreamHQ/pipedream/blob/jotform/components/jotform/jotform.app.js')
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
    const objArray = []
    const bb = new busboy({ headers: event.headers });
    let fileData = {}
    let formData = {}

    await new Promise((resolve, reject) => {
      bb.on('file', function (fieldname, file, filename, encoding, mimetype) {
        //console.log('File [%s]: filename=%j; encoding=%j; mimetype=%j', fieldname, filename, encoding, mimetype);
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