export default {
  "id": "1e6b6cc1-c760-48e0-968f-4bfaeeae9af1",
  "name": "Test Monitor",
  "uid": "12345678-1e6b6cc1-c760-48e0-968f-4bfaeeae9af1",
  "owner": 12345678,
  "collectionUid": "12345678-12ece9e1-2abf-4edc-8e34-de66e74114d2",
  "environmentUid": "12345678-5daabc50-8451-43f6-922d-96b403b4f28e",
  "options": {
      "strictSSL": true,
      "followRedirects": true,
      "requestTimeout": 3000,
      "requestDelay": 0
  },
  "notifications": {
      "onError": [
          {
              "email": "user@example.com"
          }
      ],
      "onFailure": [
          {
              "email": "user@example.com"
          }
      ]
  },
  "distribution": [],
  "schedule": {
      "cron": "0 0 * * * *",
      "timezone": "America/Chicago",
      "nextRun": "2022-06-18T05:00:00.000Z"
  },
  "lastRun": {
      "status": "failed",
      "startedAt": "2022-06-17T18:39:52.852Z",
      "finishedAt": "2022-06-17T18:39:53.707Z"
  },
  "stats": {
      "assertions": {
          "total": 8,
          "failed": 1
      },
      "requests": {
          "total": 4
      }
}
}