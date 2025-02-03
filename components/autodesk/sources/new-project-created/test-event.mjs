export default {
  "type": "projects",
  "id": "a.YnVzaW5lc3M6cGlwZWRyZWFtI0QyMDI1MDEyMDg2Mjg5MDYwNg",
  "attributes": {
    "name": "Default Project",
    "scopes": [
      "global"
    ],
    "extension": {
      "type": "projects:autodesk.core:Project",
      "version": "1.0",
      "schema": {
        "href": "https://developer.api.autodesk.com/schema/v1/versions/projects:autodesk.core:Project-1.0"
      },
      "data": {}
    }
  },
  "links": {
    "self": {
      "href": "https://developer.api.autodesk.com/project/v1/hubs/a.YnVzaW5lc3M6cGlwZWRyZWFt/projects/a.YnVzaW5lc3M6cGlwZWRyZWFtI0QyMDI1MDEyMDg2Mjg5MDYwNg"
    }
  },
  "relationships": {
    "hub": {
      "data": {
        "type": "hubs",
        "id": "a.YnVzaW5lc3M6cGlwZWRyZWFt"
      },
      "links": {
        "related": {
          "href": "https://developer.api.autodesk.com/project/v1/hubs/a.YnVzaW5lc3M6cGlwZWRyZWFt"
        }
      }
    },
    "rootFolder": {
      "data": {
        "type": "folders",
        "id": "urn:adsk.wipprod:fs.folder:co.6Nb9sJXVRNKRVbgmZyS4oQ"
      },
      "meta": {
        "link": {
          "href": "https://developer.api.autodesk.com/data/v1/projects/a.YnVzaW5lc3M6cGlwZWRyZWFtI0QyMDI1MDEyMDg2Mjg5MDYwNg/folders/urn:adsk.wipprod:fs.folder:co.6Nb9sJXVRNKRVbgmZyS4oQ"
        }
      }
    },
    "topFolders": {
      "links": {
        "related": {
          "href": "https://developer.api.autodesk.com/project/v1/hubs/a.YnVzaW5lc3M6cGlwZWRyZWFt/projects/a.YnVzaW5lc3M6cGlwZWRyZWFtI0QyMDI1MDEyMDg2Mjg5MDYwNg/topFolders"
        }
      }
    }
  }
}