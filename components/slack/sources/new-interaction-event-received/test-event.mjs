export default {
  "event": {
    "type": "block_actions",
    "user": {
      "id": "US676PZLY",
      "username": "test.user",
      "name": "test.user",
      "team_id": "TS8319547"
    },
    "api_app_id": "AN9231S6L",
    "token": "UYc82mtyZWRhvUXQ6TXrv4wq",
    "container": {
      "type": "message",
      "message_ts": "1716402983.247149",
      "channel_id": "CS8319KD5",
      "is_ephemeral": false
    },
    "trigger_id": "7161731794692.892103311143.4020ed3595908eca11e4076438354dbb",
    "team": {
      "id": "TS8319547",
      "domain": "test-j1q3506"
    },
    "enterprise": null,
    "is_enterprise_install": false,
    "channel": {
      "id": "CS8319KD5",
      "name": "testing"
    },
    "message": {
      "subtype": "bot_message",
      "text": "Click Me button Sent via <https://pipedream.com/@/p_6lCR5Nx?o=a&amp;a=slack|Pipedream>",
      "username": "Pipedream",
      "type": "message",
      "ts": "1716402983.247149",
      "bot_id": "BRTDL45RQ",
      "app_id": "AN9231S6L",
      "blocks": [
        {
          "type": "actions",
          "block_id": "SJp0j",
          "elements": [
            {
              "type": "button",
              "action_id": "button_click",
              "text": {
                "type": "plain_text",
                "text": "Click Me",
                "emoji": true
              },
              "value": "click_me_123"
            }
          ]
        },
        {
          "type": "context",
          "block_id": "ysmBN",
          "elements": [
            {
              "type": "mrkdwn",
              "text": "Sent via <https://pipedream.com/@/p_6lCR5Nx?o=a&amp;a=slack|Pipedream>",
              "verbatim": false
            }
          ]
        }
      ]
    },
    "state": {
      "values": {}
    },
    "response_url": "https://hooks.slack.com/actions/TS8319547/7156351250101/J0w1NoVIXjChEwp4WQab4tcv",
    "actions": [
      {
        "action_id": "button_click",
        "block_id": "SJp0j",
        "text": {
          "type": "plain_text",
          "text": "Click Me",
          "emoji": true
        },
        "value": "click_me_123",
        "type": "button",
        "action_ts": "1716403200.549150"
      }
    ]
  }
}