export default {
  "userId": "123",
  "eventType": "timeEntryUpdated",
  "data":
  {
     "updatedTimeEntry":
     {
         "activity":
         {
             "id": "1",
             "name": "some activity",
             "color": "#ffffff",
             "integration": "zei",
             "spaceId": "2"
         },
         "duration":
         {
             "startedAt": "2016-02-03T04:00:00.000",
             "stoppedAt": "2016-02-03T05:00:00.000"
         },
         "id": "1",
         "note":
         {
            "mentions":
            [
                {
                    "id": 1,
                    "label": "TheSheep",
                    "scope": "timeular",
                    "spaceId": "2"
                }
            ],
            "tags":
            [
                {
                    "id": 1,
                    "label": "boring",
                    "scope": "timeular",
                    "spaceId": "2"
                }
            ],
            "text": "99 sheep <{{|t|1|}}> <{{|m|1|}}>"
        }
     }
  }
}