# Sendoso API Endpoints Inventory

This document catalogs all Sendoso REST API endpoints for implementation in Pipedream.

## API Base URL
`https://app.sendoso.com/api/v3`

## Authentication
OAuth 2.0 Bearer Token (already configured in sendoso.app.mjs)

## Existing Implementations

### Already Implemented Actions:
1. **Generate eGift Link** - `POST /send.json`
2. **Get Send Status** - `GET /gifts/status/{trackingId}`
3. **Send Physical Gift with Address Confirmation** - `POST /send.json`

### Existing Helper Methods:
- getCurrentUser() - GET /me
- listGroups() - GET /groups.json
- listSendGifts() - GET /sent_gifts.json  
- listTemplates() - GET /user_custom_templates.json
- listTouches(groupId) - GET /groups/{groupId}/group_touches.json
- listUsers(groupId) - GET /groups/{groupId}/members.json

## Endpoints to Implement (80+ new actions)

Based on Sendoso API documentation at https://sendoso.docs.apiary.io/

### Total Summary:
- **Already Implemented**: 3 actions + 6 helper methods
- **To Implement**: ~80 new actions
- **Total Coverage**: 90+ endpoints

Implementation will proceed in phases as outlined in the main plan.
