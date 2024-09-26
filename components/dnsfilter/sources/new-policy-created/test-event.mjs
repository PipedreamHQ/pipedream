export default {
  "id": "string",
  "type": "string",
  "attributes": {
    "name": "string",
    "organization_id": 0,
    "whitelist_domains": [
       "string"
    ],
    "blacklist_domains": [
      "string"
    ],
    "blacklist_categories": [
      0
    ],
    "allow_unknown_domains": true,
    "google_safesearch": true,
    "bing_safe_search": true,
    "duck_duck_go_safe_search": true,
    "yandex_safe_search": true,
    "youtube_restricted": true,
    "youtube_restricted_level": "strict",
    "interstitial": true,
    "is_global_policy": true,
    "can_edit": true,
    "lock_version": 0
  },
  "relationships": {
    "organization": {
      "data": {
        "id": "string",
        "type": "string"
      }
    },
    "network_policies": {
      "data": [
        {
          "id": "string",
          "type": "string"
        }
      ]
    },
    "networks": {
      "data": [
        {
          "id": "string",
          "type": "string"
        }
      ]
    }
  }
}