# Brainbase Component for Pipedream

This component integrates Brainbase API with Pipedream, allowing you to automate workflows with Brainbase's voice AI and worker management capabilities.

## Authentication

This component uses API Key authentication. You'll need to provide your Brainbase API key when connecting the app in Pipedream.

- **Authentication Type**: API Key
- **Header**: `x-api-key`
- **Base URL**: `https://brainbase-monorepo-api.onrender.com`

## Available Actions

### Workers

- **Create Worker** - Create a new worker for the team
- **Get Worker** - Get a single worker by ID
- **List Workers** - Get all workers for the team
- **Update Worker** - Update an existing worker
- **Delete Worker** - Delete a worker

### Flows

- **Create Flow** - Create a new flow for a worker
- **Get Flow** - Get a single flow by ID
- **List Flows** - Get all flows for a worker
- **Update Flow** - Update an existing flow
- **Delete Flow** - Delete a flow

### Voice Deployments

- **Create Voice Deployment** - Create a new voice deployment
- **Get Voice Deployment** - Get a single voice deployment by ID
- **List Voice Deployments** - Get all voice deployments for a worker
- **Update Voice Deployment** - Update an existing voice deployment
- **Delete Voice Deployment** - Delete a voice deployment
- **Make Voice Batch Calls** - Make batch calls for a voice deployment

### Voice Deployment Logs

- **List Voice Deployment Logs** - List voice deployment logs with filtering and pagination
- **Get Voice Deployment Log** - Retrieve a single voice deployment log record

### Integrations (Twilio)

- **Create Twilio Integration** - Create a new Twilio integration
- **Get Integration** - Get a specific integration by ID
- **List Integrations** - Get all integrations for the team
- **Delete Integration** - Delete an existing integration

### Phone Numbers (Assets)

- **Register Phone Number** - Register a phone number via Twilio integration
- **Get Phone Numbers** - Get all registered phone numbers (with optional filtering)
- **Delete Phone Number** - Delete a registered phone number

### Team

- **Get Team** - Get the team associated with the API key

## Usage Example

### Creating a Worker and Flow

1. **Create Worker**

   ```javascript
   // Use the "Create Worker" action
   {
     "name": "Customer Support Bot",
     "description": "Handles customer inquiries",
     "status": "active"
   }
   ```

2. **Create Flow**

   ```javascript
   // Use the "Create Flow" action
   {
     "workerId": "worker_123",
     "name": "Support Flow",
     "code": "// Your flow code here",
     "validate": true
   }
   ```

3. **Create Voice Deployment**
   ```javascript
   // Use the "Create Voice Deployment" action
   {
     "workerId": "worker_123",
     "name": "Support Hotline",
     "phoneNumber": "+1234567890",
     "flowId": "flow_456",
     "enableVoiceSentiment": true,
     "externalConfig": {
       "voice": "alloy",
       "language": "en"
     }
   }
   ```

## Testing

To test the component locally:

1. Ensure you have your Brainbase API key
2. Use the Pipedream CLI or web interface to test actions
3. Start with simple actions like "Get Team" or "List Workers" to verify connectivity

## API Documentation

For more information about the Brainbase API, visit [Brainbase Documentation](https://docs.brainbase.com).

## Version

Current version: 0.0.1

## Support

For issues or questions, please contact Pipedream support or visit the [Pipedream community](https://pipedream.com/community).
