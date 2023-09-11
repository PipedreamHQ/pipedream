![](https://www.seven.io/wp-content/uploads/Logo.svg "seven Logo")

A collection of Pipedream actions for seven.

## Installation

```shell
git clone https://github.com/seven-io/pipedream-component
```

```shell
pd publish ./actions/send-sms/send-sms.mjs
pd publish ./actions/tts-call/tts-call.mjs
pd publish ./actions/lookup-cnam/lookup-cnam.mjs
pd publish ./actions/lookup-format/lookup-format.mjs
pd publish ./actions/lookup-hlr/lookup-hlr.mjs
pd publish ./actions/lookup-mnp/lookup-mnp.mjs
```

### Set API Key

[Add an environment variable](https://pipedream.com/docs/environment-variables)
called `SEVEN_API_KEY` or specify it directly in the `apiKey` field when
configuring the actions.

## Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact).

[![MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
