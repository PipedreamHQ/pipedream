export default {
  "requestId": "string",
  "data": {
    "shifts": [
      {
        "id": "string",
        "color": "string",
        "assignedUserIds": [
          0
        ],
        "startTime": 0,
        "endTime": 0,
        "timezone": "string",
        "isOpenShift": true,
        "title": "string",
        "jobId": "string",
        "locationData": {
          "isReferencedToJob": true,
          "gps": {
            "address": "string",
            "longitude": 0,
            "latitude": 0
          }
        },
        "isPublished": true,
        "isRequireAdminApproval": true,
        "updateTime": 0,
        "creationTime": 0,
        "openSpots": 0,
        "notes": [
          {
            "type": "html",
            "html": "string"
          },
          {
            "type": "album",
            "album": [
              {
                "url": "string"
              }
            ]
          },
          {
            "url": "string",
            "type": "file",
            "name": "string"
          }
        ],
        "statuses": [
          {
            "statusId": "string",
            "note": "string",
            "attachments": [
              "string"
            ],
            "creationTime": 0,
            "updateTime": 0,
            "creatingUserId": 0,
            "modifyingUserId": 0,
            "gps": {
              "address": "string",
              "longitude": 0,
              "latitude": 0
            }
          }
        ],
        "breaks": [
          {
            "id": "string",
            "name": "string",
            "type": "paid",
            "startTime": 0,
            "duration": 0
          }
        ],
        "shiftDetails": {
          "shiftLayers": [
            {
              "id": "string",
              "title": "string",
              "value": {
                "id": "string",
                "displayName": "string"
              }
            }
          ]
        }
      }
    ]
  },
  "paging": {
    "offset": 0
  }
}