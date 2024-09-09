export default {
  "id": "string",
  "name": "string",
  "status": "string",
  "outputType": "PDF",
  "size": 0,
  "createdAt": "2024-09-09T21:28:21.391Z",
  "updatedAt": "2024-09-09T21:28:21.391Z",
  "parties": [
    {
      "id": "string",
      "createdAt": "2024-09-09T21:28:21.391Z",
      "updatedAt": "2024-09-09T21:28:21.391Z",
      "role": "VIEWER",
      "identityId": "string",
      "username": "string"
    }
  ],
  "invitations": [
    {
      "id": "string",
      "createdAt": "2024-09-09T21:28:21.391Z",
      "email": "string",
      "expiresAt": "2024-09-09T21:28:21.391Z",
      "role": "VIEWER"
    }
  ],
  "files": [
    {
      "id": "string",
      "name": "string",
      "mimeType": "string",
      "size": 0,
      "createdAt": "2024-09-09T21:28:21.391Z",
      "updatedAt": "2024-09-09T21:28:21.391Z",
      "variables": [
        {
          "id": "string",
          "name": "string",
          "type": "TEXT",
          "value": "string"
        }
      ]
    }
  ],
  "signatures": [
    {
      "id": "string",
      "identityId": "string",
      "username": "string",
      "certificate": "string",
      "certificateHash": "string",
      "signature": "string",
      "visualSignatureUrl": "string",
      "contentHash": "string",
      "signingTimestamp": "2024-09-09T21:28:21.391Z",
      "type": "BASIC",
      "signingMethod": "BARE",
      "signatureProvider": "AGRELLO_ID",
      "displayName": "string"
    }
  ],
  "folderId": "string",
  "workspaceId": "string",
  "metadata": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  }
}