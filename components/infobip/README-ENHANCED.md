# Enhanced Infobip App with OpenAPI Auto-Generation

This enhanced version of the Infobip app automatically fetches and generates methods from the official OpenAPI specification at https://api.infobip.com/platform/1/openapi/sms.

## 🚀 Key Features

- **Automatic Method Generation**: All SMS API methods are auto-generated from the OpenAPI spec
- **Always Up-to-Date**: Methods stay current with the latest Infobip API
- **Backward Compatible**: Existing manual methods still work
- **Type-Safe**: JSDoc comments generated from OpenAPI descriptions
- **Dynamic Resolution**: Call any OpenAPI method by name

## 📁 File Structure

```
components/infobip/
├── infobip-enhanced.app.mjs           # Enhanced app with OpenAPI generation
├── lib/openapi-generator.mjs          # OpenAPI method generator
├── actions/send-sms-v3/
│   └── send-sms-v3.mjs               # New v3 SMS action
└── README-ENHANCED.md                 # This documentation
```

## 🔧 Setup

1. **Replace the existing app**:
   ```bash
   mv infobip.app.mjs infobip-legacy.app.mjs
   mv infobip-enhanced.app.mjs infobip.app.mjs
   ```

2. **Set up credentials**:
   - Infobip API Key
   - Base URL (defaults to `https://api.infobip.com`)

## 🎯 Usage

### Basic SMS Sending (Legacy Method)
```javascript
// Still works for backward compatibility
const response = await this.infobip.sendSms({
  data: {
    messages: [{
      destinations: [{ to: "+385996463896" }],
      from: "TestSender", 
      text: "Hello World"
    }]
  }
});
```

### New v3 SMS Sending (Recommended)
```javascript
// Uses the latest OpenAPI v3 endpoint
const response = await this.infobip.sendSmsMessage({
  data: {
    messages: [{
      sender: "TestSender",
      destinations: [{ to: "+385996463896" }],
      content: { text: "Hello World" },
      options: { flash: false }
    }]
  }
});
```

### Dynamic Method Calling
```javascript
// Call any OpenAPI method dynamically
const deliveryReports = await this.infobip.callOpenAPIMethod('getSmsDeliveryReports', {
  params: { messageId: 'your-message-id' }
});
```

### List Available Methods
```javascript
// See all auto-generated methods
const methods = await this.infobip.getOpenAPIMethods();
console.log('Available methods:', methods);
```

## 📋 Auto-Generated Methods

The following methods are automatically generated from the OpenAPI spec:

### SMS Operations
- `sendSmsMessages` - Send SMS using v3 API *(recommended)*
- `getSmsDeliveryReports` - Get delivery reports  
- `getSmsLogs` - Get SMS logs
- `getScheduledSmsMessages` - Get scheduled messages
- `updateScheduledSmsStatus` - Update scheduled message status
- `rescheduleScheduledSms` - Reschedule messages
- `previewSms` - Preview SMS before sending
- `getInboundSmsMessages` - Get inbound messages

### Delivery Reports & Webhooks
- `receiveOutboundSmsMessageReports` - Handle delivery report webhooks
- `receiveOutboundSmsMessageReportV3` - Handle v3 delivery reports

## 🔍 Advanced Features

### Debug OpenAPI Spec
```javascript
// View the full OpenAPI specification
const spec = await this.infobip.debugOpenAPISpec();
console.log('OpenAPI version:', spec.info.version);
```

### Method Information
```javascript
// Get details about a specific method
const generator = await this.infobip._initOpenAPI();
const methodInfo = generator.getMethod('sendSmsMessages');
console.log('Method details:', methodInfo);
```

## 📱 New v3 SMS Action

Use the new `send-sms-v3` action for enhanced features:

**Features:**
- Latest v3 API endpoint
- Transliteration support (Turkish, Greek, Cyrillic, etc.)
- Language code specification
- Flash SMS support
- Delivery time windows
- Campaign tracking
- Enhanced error handling

**Example Workflow:**
```javascript
export default defineComponent({
  props: {
    infobip: { app: "infobip" },
    // ... other props
  },
  async run({ steps, $ }) {
    return await this.infobip.sendSmsMessage({
      $,
      data: {
        messages: [{
          sender: "MyApp",
          destinations: [{ to: "+1234567890" }],
          content: {
            text: "Welcome to our service!",
            transliteration: "TURKISH",
            language: { languageCode: "TR" }
          },
          options: {
            flash: false,
            validityPeriod: { amount: 24, timeUnit: "HOURS" }
          }
        }]
      }
    });
  }
});
```

## 🛠️ Troubleshooting

### OpenAPI Fetch Issues
If the OpenAPI spec fails to load:
1. Check internet connectivity
2. Verify API credentials
3. Check if the OpenAPI URL is accessible
4. Fallback to manual methods will still work

### Method Not Found
```javascript
// List all available methods to debug
const methods = await this.infobip.debugAvailableMethods();
console.log('Available methods:', methods);
```

### API Errors
The enhanced app provides detailed error messages:
```javascript
try {
  await this.infobip.sendSmsMessage({ data: payload });
} catch (error) {
  console.error('API Error:', error.response?.data);
}
```

## 🔄 Migration Guide

### From Legacy App
1. **Update imports**: Change to `infobip-enhanced.app.mjs`
2. **Update actions**: Use new v3 methods where available
3. **Test thoroughly**: Verify all workflows still function

### Method Mapping
| Legacy Method | New Method | Notes |
|---------------|------------|-------|
| `sendSms` | `sendSmsMessage` | Use v3 API format |
| `sendSmsV3` | `sendSmsMessage` | Same method, improved |
| `getSmsDeliveryReports` | Auto-generated | From OpenAPI |
| `getSmsLogs` | Auto-generated | From OpenAPI |

## 📚 References

- [Infobip OpenAPI Specification](https://api.infobip.com/platform/1/openapi/sms)
- [Infobip SMS Documentation](https://www.infobip.com/docs/sms)
- [Original Pipedream Component](/components/infobip/infobip.app.mjs)

## 🔧 Testing

Run the test script:
```bash
node test-enhanced-infobip.mjs
```

This will validate:
- OpenAPI spec fetching
- Method generation
- Payload formatting
- Error handling
