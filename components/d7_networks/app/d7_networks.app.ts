import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "d7_networks",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});


//send_sms.mjs

import {axios} from "@pipedream/platform";

export default {
  name: "Send_sms",
  version: "0.1.0",
  key: "send_sms",
  description: "Sending sms via D7 networks!",
  type: "action",
  props: {
    
      d7_networks: {
        type: "app",
        app: "d7_networks",
      },
    originator:{
      type:"string",
      label:"Originator",
      description:"Originator of the message",
    },
    recipients:{
      type:"string",
      label:"Recipients",
      description:"Recipients of the message",
    },
    content:{
      type:"string",
      label:"Content",
      description:"Content of the message",
    },
    data_coding:{
      type:"string",
      label:"Data encoding",
      description:"Messaging Channel (SMS, WhatsApp, Viber, Telegram,etc)",
      async options() {
        return ["Unicode", "Text","Auto"];
      }
    },
    report_url:{
      type:"string",
      label:"Report url",
      description:"Your call back server URL to recieve delivery status",
      optional: true,
    },
  },

  methods: {},
  async run({ $ }) {
    var data = JSON
    .stringify({
      "messages": [
          {
          "channel": this.channel,
          "recipients": [
              this.recipients
          ],
          "content": this.content,
          "msg_type": "text",
          "data_coding": "text"
          }
      ],
      "message_globals": {
          "originator": this.originator,
          "report_url": "https://the_url_to_recieve_delivery_report.com"
      }
      "client_ref":'pipedream'
      }); 
      var config = {
        method: 'post',
        url: 'https://api.d7networks.com/messages/v1/send',
        headers: {
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          Authorization: `Bearer ${this.d7_networks.$auth.oauth_access_token}`,
        },
        data : data
      };
      const response=await axios($, config);
      $.export("$summary", 'Message sent successfully!');
      return response;
  },
};
