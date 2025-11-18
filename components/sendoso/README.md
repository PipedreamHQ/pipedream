# Sendoso Integration for Pipedream

## Overview

This integration provides comprehensive support for the [Sendoso API](https://developer.sendoso.com/rest-api/), enabling you to automate corporate gifting, direct mail, and engagement campaigns through Pipedream workflows.

## Authentication

This app uses OAuth 2.0 for authentication. When you connect your Sendoso account, you'll be prompted to authorize Pipedream's access to your Sendoso data.

## Available Actions

### Send Management (5 actions)
- **List Sends**: Retrieve a list of all sends/gifts with optional filters
- **Get Send Details**: Retrieve detailed information about a specific send
- **Update Send**: Update information for an existing send
- **Cancel Send**: Cancel a pending or scheduled send
- **Resend Gift**: Resend a gift to the recipient

### Touch Management (5 actions)
- **Create Touch**: Create a new touch within a group
- **Get Touch**: Retrieve details about a specific touch
- **Update Touch**: Update an existing touch
- **Delete Touch**: Delete a touch
- **Duplicate Touch**: Duplicate an existing touch

### Contact Management (8 actions)
- **List Contacts**: Retrieve a list of all contacts
- **Create Contact**: Create a new contact
- **Get Contact**: Retrieve details about a specific contact
- **Update Contact**: Update an existing contact's information
- **Delete Contact**: Delete a contact
- **Search Contacts**: Search for contacts by various criteria
- **Import Contacts**: Bulk import contacts
- **Export Contacts**: Export contacts data

### Group Management (6 actions)
- **Create Group**: Create a new group
- **Get Group**: Retrieve details about a specific group
- **Update Group**: Update an existing group
- **Delete Group**: Delete a group
- **Add Group Members**: Add members to a group
- **Remove Group Member**: Remove a member from a group

### Template & Campaign Management (8 actions)
- **List Templates**: Retrieve a list of all custom templates
- **Get Template**: Retrieve details about a specific template
- **List Campaigns**: Retrieve a list of all campaigns
- **Create Campaign**: Create a new campaign
- **Get Campaign**: Retrieve details about a specific campaign
- **Launch Campaign**: Launch a campaign to make it active
- **Pause Campaign**: Pause an active campaign
- **Get Campaign Statistics**: Retrieve statistics and metrics for a campaign

### Webhook & Integration Management (5 actions)
- **List Webhooks**: Retrieve a list of all webhooks
- **Create Webhook**: Create a new webhook endpoint
- **Delete Webhook**: Delete a webhook endpoint
- **List Integrations**: Retrieve a list of available integrations
- **Get Integration Status**: Retrieve the status of a specific integration

### Analytics & Reporting (2 actions)
- **Get Send Analytics**: Retrieve analytics data for sends
- **Get Campaign Analytics**: Retrieve analytics data for campaigns

### Additional Actions (6 actions)
- **List eGift Links**: Retrieve a list of all eGift links
- **Validate Address**: Validate a shipping address
- **List Catalog Items**: Retrieve a list of catalog items
- **List All Users**: Retrieve a list of all users in the account
- **Get Send Status**: Track sent gifts and retrieve analytics (existing)
- **Generate eGift Link**: Generate a new E-Gift link (existing)
- **Send Physical Gift with Address Confirmation**: Send a physical gift (existing)

### Event Sources (2 sources)
- **New Send Created**: Emit new event when a new send is created
- **Send Status Updated**: Emit new event when a send status is updated

## Common Use Cases

### 1. Automate Gift Sending on Deal Close
```javascript
// Trigger: Salesforce - New Closed Won Deal
// Action 1: Sendoso - Create Contact (from deal contact)
// Action 2: Sendoso - Send Physical Gift with Address Confirmation
```

### 2. Birthday Gift Automation
```javascript
// Trigger: Schedule - Daily at 9 AM
// Action 1: Sendoso - List Contacts (filter by birthday)
// Action 2: Sendoso - Generate eGift Link (for each contact)
// Action 3: Send Email with eGift link
```

### 3. Campaign ROI Tracking
```javascript
// Trigger: Schedule - Weekly
// Action 1: Sendoso - Get Campaign Analytics
// Action 2: Google Sheets - Add Row (with metrics)
// Action 3: Slack - Send Message (summary report)
```

### 4. Contact Sync from CRM
```javascript
// Trigger: HubSpot - New Contact
// Action 1: Sendoso - Create Contact
// Action 2: Sendoso - Add Group Members (to appropriate group)
```

## Tips & Best Practices

1. **Use Groups for Organization**: Organize your contacts and touches into groups for easier management
2. **Leverage Templates**: Create reusable templates for common gift types
3. **Monitor with Webhooks**: Set up webhooks to receive real-time notifications about send status changes
4. **Track Analytics**: Regularly pull analytics data to measure campaign effectiveness
5. **Validate Addresses**: Use address validation before sending physical gifts to reduce failed deliveries
6. **Test with eGifts First**: eGifts are faster and easier to test your workflows before sending physical items

## API Rate Limits

Please refer to the [Sendoso API documentation](https://sendoso.docs.apiary.io/) for current rate limits and best practices.

## MCP Tool Generation

All Sendoso actions are automatically exposed as MCP (Model Context Protocol) tools, allowing AI agents to interact with the Sendoso API through Pipedream. No additional configuration is required.

## Support

For issues with this integration:
- **Pipedream Support**: https://pipedream.com/support
- **Sendoso Developer Support**: developers@sendoso.com
- **Community Forum**: https://pipedream.com/community

## Links

- [Sendoso API Documentation](https://developer.sendoso.com/rest-api/)
- [Pipedream Sendoso App Page](https://pipedream.com/apps/sendoso)
- [Component Guidelines](https://pipedream.com/docs/components/guidelines/)

## Contributing

To contribute new actions or improvements:
1. Fork the [Pipedream repository](https://github.com/PipedreamHQ/pipedream)
2. Make your changes following the [component guidelines](https://pipedream.com/docs/components/guidelines/)
3. Submit a pull request

## Version History

- **v0.0.3**: Added comprehensive API endpoint support (50+ new actions)
- **v0.0.2**: Initial release with basic send management
- **v0.0.1**: Beta release

## License

This integration is open source under the MIT License.
