const http = require('../../http.app.js')
const axios = require('axios')
const { v4: uuid } = require("uuid")
const crypto = require('crypto')
const _ = require('lodash')
const flatted = require('flatted')

module.exports = {
  key: "http-pollling",
  name: "New Polled Event",
  description: "Poll a URL and emit events. Customize the event payload (you may emit the entire body or individual array elements), the JSON path to the payload, emit uniqueness (and the key to identify unique emits), and more.",
  version: "0.0.2",
  props: {
    http,
    url: { propDefinition: [http, "url"] },
    emit: {
      type: "string",
      description: "By default, this source emits the `Response Body` of the HTTP response as the event. If the response includes an array of elements, you can emit each element as an event by selecting `Individual Array Elements` (if the array is not the root element of the response body, then provide the JSON path to the array below).",
      options: [
        'Response Body',
        'Individual Array Elements',
      ],
      default: "Response Body",
      optional: true,
    },
    jsonPath: {
      type: "string",
      label: "JSON Path",
      description: "If the content fetched is JSON, optionally define a path to extract data from the content using dot notation (e.g., `statuses` or `foo.statuses`).",
      optional: true,
    },
    unique: {
      type: "boolean",
      label: "Enforce Uniqueness",
      description: "Only emit an event if data has changed (`true` by default). The deduplication strategy enforces uniqueness across the last 100 unique emits. You may optionally specifiy a key below to check for uniqueuness. If no key is specified, the content hash will be used. Set to `false` to emit every event, even if duplicate.",
      default: true,
    },
    id: {
      type: "string",
      label: "Unique Key",
      description: "If you are enforcing uniqueness in the emits, optionally provide a key to use to dedupe emits (e.g., `id_str`). If **Enforce Uniqueness** is set to `false`, this field will be ignored.",
      optional: true,
    },
    username: {
      type: "string",
      label: "HTTP Basic Auth: Username",
      description: "If you are enforcing uniqueness in the emits, optionally provide a key to use to dedupe emits (e.g., `id_str`). If **Enforce Uniqueness** is set to `false`, this field will be ignored.",
      optional: true,
    },
    password: {
      type: "string",
      label: "HTTP Basic Auth: Password",
      description: "If you are enforcing uniqueness in the emits, optionally provide a key to use to dedupe emits (e.g., `id_str`). If **Enforce Uniqueness** is set to `false`, this field will be ignored.",
      optional: true,
    },
    //headers: { propDefinition: [http, "headers"] },
    //params: { propDefinition: [http, "params"] },
    //auth: { propDefinition: [http, "auth"] },
    timer: {
      type: "$.interface.timer",
      label: "Frequency",
      description: "Configure the frequency to check for data.",
      default: {
        intervalSeconds: 60*15,
      },
    },
  },
  dedupe: "unique",
  async run(event) {
    let id, data
    
    const response = await axios.get(this.url)
    
    if(this.emit === 'Response Body' || this.emit === 'Individual Array Elements') {
      data = response.data
    } else {
      data = flatted.parse(response)
    }
    
    if (this.jsonPath) {
      data = _.get(data,this.jsonPath)
    }

    if(this.emit === 'Individual Array Elements' && Array.isArray(data)) {

      data.forEach(el => {
        if(this.unique) {
          if(this.id) {
            id = _.get(el,this.id)
          } else {
            id = crypto.createHash('md5').update(JSON.stringify(el)).digest('hex')
          }
        } else {
          id = uuid()
        }

        console.log(id)

        this.$emit(el, {
          summary: JSON.stringify(el),
          id,
        })
      })
    } else {
      if(this.unique) {
        if(this.key) {
          id = _.get(data,this.id)
        } else {
          id = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')
        }
      } else {
        id = uuid()
      }
      this.$emit(data, {
        summary: JSON.stringify(data),
        id,
      })
    }
  }
};