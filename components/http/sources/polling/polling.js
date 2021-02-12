const http = require('../../http.app.js')
const axios = require('axios')
const { v4: uuid } = require("uuid")
const crypto = require('crypto')
const _ = require('lodash')

module.exports = {
  key: "http-pollling",
  name: "Polling",
  description: "Poll a URL and emit events.",
  version: "0.0.2",
  props: {
    http,
    url: "string",
    emit: {
      type: "string",
      options: [
        'Single Element',
        'Individual Array Elements',
      ],
      optional: true,
    },
    jsonPath: {
      type: "string",
      optional: true,
    },
    unique: {
      type: "boolean",
      default: true,
    },
    id: {
      type: "string",
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60*15,
      },
    },
  },
  dedupe: "unique",
  async run(event) {
    let id, data
    
    data = (await axios.get(this.url)).data
    console.log(data)
    if (this.jsonPath) {
      data = _.get(data,this.jsonPath)
    }
    console.log(data)

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