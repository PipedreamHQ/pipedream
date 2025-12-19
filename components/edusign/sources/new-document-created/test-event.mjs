export default {
  "ID": "6m2zjwqb4o579dw2",
  "NAME": "unicorn.pdf",
  "TEMPLATE": "<style></style>",
  "SCHOOL_ID": "pespg7dmtae78xio",
  "VARIABLES": {
    "emails": {
      "documentSent": {
        "body": "",
        "subject": "Edusign has sent you a document to sign - doc.pdf"
      },
      "signatureReminder": {
        "body": "",
        "amount": 3,
        "subject": "Edusign has sent you a document to sign - doc.pdf",
        "interval": 86400,
        "emailsAlreadySent": []
      }
    },
    "version": "v2",
    "carbonCopy": [],
    "recipients": [
      {
        "id": "31h81s28fua78xio",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "index": 0,
        "order": 0,
        "phone": "",
        "token": "26e7748e-5cef-4ab7-abce-7e07f3b8733a",
        "category": "admin",
        "lastname": "Doe",
        "firstname": "John",
        "signatureNeeded": true,
        "signatureState": "signed",
        "signatureDate": "2025-12-11T18:52:18.455Z"
      }
    ],
    "validationMethod": "sms",
    "sendEmailWhenCompleted": true
  },
  "INPUTS": [
    {
      "id": 253372,
      "type": "SIGNATURE",
      "index": 0,
      "label": "Signature",
      "style": {
        "fontSize": "12px",
        "fontStyle": "normal",
        "fontWeight": "normal",
        "textDecoration": "none"
      },
      "value": "https://signatures.core.edusign.fr/",
      "category": "admin",
      "personId": "31h81s28fua78xio",
      "position": {
        "x": 52.67610080685908,
        "y": 453.69979639780735,
        "page": 3,
        "width": 98.99002990033225,
        "height": 52.80375880971025
      },
      "required": true,
      "signatureType": "handwritten"
    }
  ],
  "METADATAS": [
    {
      "SIGNATURE_URL": "https://signatures.core.edusign.fr/",
      "SIGNATORY_TYPE": "admin",
      "SIGNATURE_DATE": "2025-12-11T18:52:18.455Z",
      "SIGNATURE_SIGN": "335deb1b411a565647476feebf5ce534",
      "SIGNATORY_EMAIL": "john.doe@example.com",
      "SIGNATORY_TOKEN": "26e7748e-5cef-4ab7-abce-7e07f3b8733a",
      "VALIDATION_CODE": "",
      "SIGNATORY_FULLNAME": "John Doe"
    }
  ],
  "STUDENT_ID": "",
  "PROFESSOR_ID": "",
  "ADMIN_ID": "31h81s28fua78xio",
  "USER_ID": "",
  "DIRECTORY_ID": null,
  "TEMPLATE_ID": "5fvux7my93q79du2",
  "DOCUMENT_SECURED": true,
  "DOCUMENT_URL": "https://s3-edusign.s3.eu-west-3",
  "DOCUMENT_PROOF_URL": "https://s3-edusign.s3.eu-west-3",
  "DOCUMENT_SIGNATURE_CODES": [],
  "STUDENT_DOWNLOAD_DOCUMENT": true,
  "YOUSIGN_PROCEDURE": "",
  "AUTOMATIC_EMAIL_SEND": true,
  "DATE_CREATED": "2025-12-11T18:52:20.000Z",
  "DATE_UPDATED": "2025-12-11T18:52:20.000Z",
  "DATE_EXPIRED": null,
  "TO_DELETE": false,
  "DELETED_BY": null,
  "TRAINING_ID": null,
  "PDF_URL": "https://s3-edusign.s3.eu-west-3.amazonaws.com",
  "version": "v2",
  "TYPE": 2,
  "STATE": "completed"
}