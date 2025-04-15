export default {
  "id": 1,
  "expenseClaimId": 1,
  "lineNumber": 1,
  "isControlled": true,
  "purchasedOn": "2023-11-07T05:31:56Z",
  "createdOn": "2023-11-07T05:31:56Z",
  "modifiedOn": "2023-11-07T05:31:56Z",
  "originalTransaction": {
    "grossAmount": 123,
    "currencyId": "<string>",
    "isExpenseAbroad": true,
    "currency": {
      "id": "<string>",
      "name": "<string>",
      "url": "<string>"
    }
  },
  "processedAmounts": {
    "grossAmount": 123,
    "currencyId": "<string>",
    "currency": {
      "id": "<string>",
      "name": "<string>",
      "url": "<string>"
    },
    "netAmount": 123,
    "vatBases": [
      {
        "countryVatRateId": 2,
        "countryVatRate": {
          "id": 2,
          "name": "<string>",
          "url": "<string>"
        },
        "vatAmount": 123,
        "amountExcludingVat": 123
      }
    ]
  },
  "expenseNatureId": 1,
  "mileage": {
    "distance": 123,
    "power": 123,
    "waypoints": [
      "<any>"
    ]
  },
  "quantity": 1,
  "effectiveQuantity": 2,
  "attendees": {
    "internal": [
      {
        "id": 123,
        "name": "<string>",
        "url": "<string>",
        "displayName": "<string>",
        "modifiedOn": "<string>",
        "lastName": "<string>",
        "firstName": "<string>",
        "login": "<string>",
        "mail": "<string>",
        "dtContractStart": "<string>",
        "dtContractEnd": "<any>",
        "birthDate": "<string>",
        "employeeNumber": "<string>",
        "calendar": {
          "id": 123,
          "url": "<string>",
          "name": "<string>"
        },
        "culture": {
          "id": 123,
          "name": "<string>",
          "url": "<string>"
        },
        "picture": {
          "id": "<string>",
          "url": "<string>",
          "name": "<string>"
        },
        "applicationData": {
          "profile_figgo": {
            "id": 123,
            "name": "<string>",
            "url": "<string>"
          },
          "profile_utime": {
            "id": 123,
            "name": "<string>",
            "url": "<string>"
          }
        },
        "legalEntity": {
          "id": 123,
          "name": "<string>",
          "url": "<string>"
        },
        "department": {
          "id": 123,
          "name": "<string>",
          "url": "<string>"
        },
        "manager": {
          "id": 123,
          "name": "<string>",
          "url": "<string>"
        },
        "rolePrincipal": {
          "id": 123,
          "name": "<string>",
          "url": "<string>"
        },
        "habilitedRoles": [
          {
            "id": 123,
            "name": "<string>",
            "url": "<string>"
          }
        ],
        "userWorkCycles": [
          {
            "Id": 123,
            "OwnerID": 123,
            "WorkCycleID": 123,
            "StartsOn": "<string>",
            "EndsOn": "<string>"
          }
        ]
      }
    ],
    "external": [
      {
        "id": 2,
        "displayName": "<string>"
      }
    ]
  },
  "axisSections": [
    {
      "id": 2,
      "code": "<string>",
      "name": "<string>",
      "multilingualName": "<string>",
      "description": "<string>",
      "ownerId": 2,
      "startOn": "2023-11-07T05:31:56Z",
      "endOn": "2023-11-07T05:31:56Z",
      "active": true,
      "axisId": 123,
      "parentAxisSections": [
        {}
      ],
      "childrenAxisSections": [
        {}
      ]
    }
  ],
  "customFields": {},
  "merchant": "<string>",
  "comment": "<string>",
  "expenseReceipts": [
    {
      "id": "<string>"
    }
  ],
  "authorizedActions": {
    "isCancellable": true,
    "isEditable": true
  },
  "sourceId": {
    "id": "<string>"
  },
  "source": {
    "id": 123,
    "name": "<string>",
    "code": "<string>"
  },
  "ownerId": 123,
  "paymentMethodId": 0
}