export default {
  "eventId": "6a12d80d8ce4ed8f2d3e5b86",
  "event": "envelope.completed",
  "timestamp": "2026-05-26T00:00:00.000Z",
  "resource": {
    "kind": "envelope",
    "id": "6a12d80d8ce4ed8f2d3e5b86",
  },
  "data": {
    "envelope": {
      "id": "6a12d80d8ce4ed8f2d3e5b86",
      "status": "completed",
      "documents": [
        {
          "sourceDocumentId": "6a12d80d8ce4ed8f2d3e5b86",
          "signedDocumentId": "6a12d80d8ce4ed8f2d3e5b86",
          "auditLogDocumentId": "6a12d80d8ce4ed8f2d3e5b86",
          "name": "Sample Agreement.pdf",
          "status": "completed",
          "recipients": [
            {
              "email": "recipient@example.com",
              "name": "Sample Recipient",
              "status": "signed",
              "previewLink": "https://document-sandbox.pdfgate.com/preview/dfbdfbdbfjbfbdfbsdsfdsfdsfsdssd",
            },
          ],
        },
      ],
      "createdAt": "2026-05-26T00:00:00.000Z",
      "completedAt": "2026-05-26T00:00:00.000Z",
    },
  },
};
