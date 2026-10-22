# Enhanced Infobip App

Auto-generated Infobip SMS components using the official OpenAPI specification.

## Features

- **Auto-Generated Methods**: All SMS API methods from OpenAPI spec
- **Always Up-to-Date**: Methods stay current with latest Infobip API
- **Backward Compatible**: Existing manual methods still work
- **Type-Safe**: JSDoc comments from OpenAPI descriptions

## Quick Start

### Send SMS (v3 - Recommended)
```javascript
const response = await this.infobip.sendSmsMessage({
  data: {
    messages: [{
      sender: "TestSender",
      destinations: [{ to: "+1234567890" }],
      content: { text: "Hello World" }
    }]
  }
});
```

### Legacy Method (Still Works)
```javascript
const response = await this.infobip.sendSms({
  data: {
    messages: [{
      destinations: [{ to: "+1234567890" }],
      from: "TestSender", 
      text: "Hello World"
    }]
  }
});
```

## Available Scripts

Run these npm scripts for development:

```bash
# Generate enhanced app with OpenAPI methods
npm run generate-infobip-enhanced-app

# Generate action components from OpenAPI spec  
npm run generate-infobip-actions
```

## Auto-Generated Methods

Key methods available from OpenAPI:

- `sendSmsMessages` - Send SMS (v3 API)
- `getSmsDeliveryReports` - Get delivery reports  
- `getSmsLogs` - Get SMS logs
- `getScheduledSmsMessages` - Get scheduled messages
- `previewSms` - Preview SMS before sending
- `getInboundSmsMessages` - Get inbound messages

## Advanced Usage

### List All Methods
```javascript
const methods = await this.infobip.getOpenAPIMethods();
console.log('Available methods:', methods);
```

### Dynamic Method Calling
```javascript
const reports = await this.infobip.callOpenAPIMethod('getSmsDeliveryReports', {
  params: { messageId: 'your-message-id' }
});
```

### Debug OpenAPI Spec
```javascript
const spec = await this.infobip.debugOpenAPISpec();
console.log('OpenAPI version:', spec.info.version);
```

## Troubleshooting

**OpenAPI Fetch Issues**: If spec fails to load, fallback manual methods still work.

**Method Not Found**: 
```javascript
const methods = await this.infobip.debugAvailableMethods();
```

## References

- [Infobip OpenAPI Spec](https://api.infobip.com/platform/1/openapi/sms)
- [Infobip SMS Docs](https://www.infobip.com/docs/sms)