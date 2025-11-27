export default {
  "eventType": "updatedUser",
  "eventPayload": {
    "changedFields": {
      "firstName": {
        "newValue": "John",
        "oldValue": "Martin"
      },
      "lastName": {
        "newValue": "Doe",
        "oldValue": "Smith"
      },
      "name": {
        "newValue": "John Doe",
        "oldValue": "Martin Smith"
      }
    },
    "source": "api"
  },
  "endUserData": [
    {
      "email": "email@test.com",
      "firstName": "Martin",
      "lastName": "Smith",
      "name": "Martin Smith",
      "lastActivity": "2025-11-20T19:08:19.373Z",
      "createdAt": "2025-11-20T19:08:19.366Z",
      "leadScore": 0,
      "updatedAt": "2025-11-20T19:21:59.973Z",
      "id": "12345678-1234-1234-1234-1234567890",
      "validationResult": "invalid",
      "validationConfidence": 75,
      "isEmailDisposable": false,
      "isEmailRole": false,
      "data": {
        "field01": "value 01",
        "field02": "value 02",
        "additionalFields": {
          "field01": "value 01",
          "field02": "value 02"
        }
      }
    }
  ]
}