// Read the Twilio docs at https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource
const twilio = require('../../twilio.app.js')
const phone = require('phone')
 
module.exports = {  
  key: "twilio-make-phone-call",
  name: "Make a Phone Call",
  description: "Make a phone call, passing text that Twilio will speak to the recipient of the call.",
  version: "0.0.2",
  type: "action",
  props: {
    twilio,
    from: { propDefinition: [ twilio, "from" ] },
    to: { propDefinition: [ twilio, "to" ] },
    text: { 
      type: "string",
      description: "The text you'd like Twilio to speak to the user when they pick up the phone.",
    },
  },
  async run(event) {
    // Parse the given number into its E.164 equivalent
    // The E.164 phone number will be included in the first element
    // of the array, but the array will be empty if parsing fails.
    // See https://www.npmjs.com/package/phone
    const toParsed = phone(this.to)
    if (!toParsed.length) {
      throw new Error(`Phone number ${this.to} couldn't be parsed as a valid number.`)
    }

    const data = {
      to: toParsed[0],
      from: this.from,
      twiml: `<Response><Say>${this.text}</Say></Response>`,
    }

    return await this.twilio.getClient().calls.create(data)
  },
}