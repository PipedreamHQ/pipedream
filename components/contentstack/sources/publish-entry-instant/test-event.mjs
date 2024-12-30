export default {
  "module": "entry",
  "api_key": "blt6e39cdfaac74824c",
  "event": "publish",
  "bulk": true,
  "data": {
    "locale": "en",
    "status": "success",
    "action": "publish",
    "entry": {
      "_version": 1,
      "deleted_at": false,
      "locale": "en",
      "uid": "blt6b0da76c39f34851",
      "_in_progress": false,
      "content": {
        "type": "doc",
        "attrs": {},
        "uid": "d05b26fe64214bca883e5e31eb11090c",
        "children": [
          {
            "type": "p",
            "attrs": {},
            "uid": "5a4f78e3731748d284c83d93ecd794a3",
            "children": [
              {
                "text": ""
              }
            ]
          }
        ],
        "_version": 1
      },
      "cover_image": {
        "parent_uid": null,
        "title": "george.jpg",
        "uid": "blt81f45c9d5c3103de",
        "created_by": "cs52122cc4ac22f20e",
        "updated_by": "cs52122cc4ac22f20e",
        "created_at": "2024-12-19T20:55:53.701Z",
        "updated_at": "2024-12-19T20:55:53.701Z",
        "deleted_at": false,
        "content_type": "image/jpeg",
        "file_size": "463713",
        "filename": "george.jpg",
        "dimension": {
          "height": 1548,
          "width": 1353
        },
        "_version": 1,
        "is_dir": false,
        "tags": [],
        "url": "https://images.contentstack.io/v3/assets/blt6e39cdfaac74824c/blt81f45c9d5c3103de/67648859989c5367eed4ffdb/george.jpg"
      },
      "created_at": "2024-12-19T21:29:49.303Z",
      "created_by": "cs52122cc4ac22f20e",
      "related_articles": {
        "heading": "Related Headline",
        "sub_heading": "Related Subhead",
        "number_of_articles": 6
      },
      "related_links": {
        "text": "Related Links"
      },
      "seo": {
        "title": "Title",
        "description": "Description",
        "canonical_url": "/",
        "no_index": true,
        "no_follow": true
      },
      "show_related_articles": false,
      "show_related_links": false,
      "summary": "Summary",
      "tags": [],
      "taxonomies": [],
      "title": "test article",
      "updated_at": "2024-12-19T21:29:49.303Z",
      "updated_by": "cs52122cc4ac22f20e",
      "url": "/article/test-article",
      "publish_details": {
        "environment": "blt78bb9fab298c6744",
        "locale": "en",
        "time": "2024-12-19T21:30:01.252Z",
        "user": "cs52122cc4ac22f20e"
      }
    },
    "content_type": {
      "title": "Article",
      "uid": "article",
      "schema": [
        {
          "data_type": "text",
          "display_name": "Title",
          "field_metadata": {
            "_default": true,
            "placeholder": "Title",
            "version": 3
          },
          "mandatory": true,
          "uid": "title",
          "unique": true,
          "multiple": false,
          "non_localizable": false,
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "text",
          "display_name": "URL",
          "uid": "url",
          "field_metadata": {
            "_default": true,
            "version": 3
          },
          "multiple": false,
          "unique": false,
          "mandatory": false,
          "non_localizable": false,
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "file",
          "display_name": "Cover image",
          "uid": "cover_image",
          "field_metadata": {
            "description": "",
            "rich_text_type": "standard",
            "image": true
          },
          "mandatory": true,
          "multiple": false,
          "non_localizable": false,
          "unique": false,
          "dimension": {
            "width": {
              "min": null,
              "max": null
            },
            "height": {
              "min": null,
              "max": null
            }
          },
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "text",
          "display_name": "Summary",
          "uid": "summary",
          "field_metadata": {
            "description": "",
            "default_value": "Summary",
            "multiline": true,
            "placeholder": "Summary",
            "version": 3
          },
          "format": "",
          "error_messages": {
            "format": ""
          },
          "mandatory": false,
          "multiple": false,
          "non_localizable": false,
          "unique": false,
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "taxonomy",
          "display_name": "Taxonomy",
          "uid": "taxonomies",
          "taxonomies": [
            {
              "taxonomy_uid": "region",
              "mandatory": false,
              "multiple": true,
              "non_localizable": false
            },
            {
              "taxonomy_uid": "topic",
              "mandatory": false,
              "multiple": true,
              "non_localizable": false
            }
          ],
          "field_metadata": {
            "description": "",
            "default_value": ""
          },
          "format": "",
          "error_messages": {
            "format": ""
          },
          "mandatory": false,
          "multiple": true,
          "non_localizable": false,
          "unique": false,
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "json",
          "display_name": "Content",
          "uid": "content",
          "field_metadata": {
            "allow_json_rte": true,
            "embed_entry": false,
            "description": "",
            "default_value": "",
            "multiline": false,
            "rich_text_type": "advanced",
            "options": []
          },
          "format": "",
          "error_messages": {
            "format": ""
          },
          "reference_to": [
            "sys_assets"
          ],
          "multiple": false,
          "non_localizable": false,
          "unique": false,
          "mandatory": false,
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "boolean",
          "display_name": "Show Related Links",
          "uid": "show_related_links",
          "field_metadata": {
            "description": "",
            "default_value": false
          },
          "mandatory": false,
          "multiple": false,
          "non_localizable": false,
          "unique": false,
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "group",
          "display_name": "Related Links",
          "field_metadata": {
            "description": "",
            "instruction": ""
          },
          "schema": [
            {
              "data_type": "text",
              "display_name": "Text",
              "uid": "text",
              "field_metadata": {
                "description": "",
                "default_value": "Related Links",
                "placeholder": "Text",
                "version": 3
              },
              "format": "",
              "error_messages": {
                "format": ""
              },
              "mandatory": false,
              "multiple": false,
              "non_localizable": false,
              "unique": false,
              "indexed": false,
              "inbuilt_model": false
            }
          ],
          "uid": "related_links",
          "mandatory": false,
          "multiple": false,
          "non_localizable": false,
          "unique": false,
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "boolean",
          "display_name": "Show related articles",
          "uid": "show_related_articles",
          "field_metadata": {
            "description": "",
            "default_value": false
          },
          "mandatory": false,
          "multiple": false,
          "non_localizable": false,
          "unique": false,
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "group",
          "display_name": "Related articles",
          "field_metadata": {
            "description": "",
            "instruction": ""
          },
          "schema": [
            {
              "data_type": "text",
              "display_name": "Heading",
              "uid": "heading",
              "field_metadata": {
                "description": "",
                "default_value": "Related Headline",
                "placeholder": "Related Articles",
                "version": 3
              },
              "format": "",
              "error_messages": {
                "format": ""
              },
              "mandatory": false,
              "multiple": false,
              "non_localizable": false,
              "unique": false,
              "indexed": false,
              "inbuilt_model": false
            },
            {
              "data_type": "text",
              "display_name": "Sub heading",
              "uid": "sub_heading",
              "field_metadata": {
                "description": "",
                "default_value": "Related Subhead",
                "multiline": true,
                "placeholder": "Related Subheading",
                "version": 3
              },
              "format": "",
              "error_messages": {
                "format": ""
              },
              "mandatory": false,
              "multiple": false,
              "non_localizable": false,
              "unique": false,
              "indexed": false,
              "inbuilt_model": false
            },
            {
              "data_type": "number",
              "display_name": "Number of articles",
              "uid": "number_of_articles",
              "field_metadata": {
                "description": "",
                "default_value": 6,
                "placeholder": "Number of articles"
              },
              "mandatory": false,
              "multiple": false,
              "non_localizable": false,
              "unique": false,
              "min": 1,
              "max": 6,
              "indexed": false,
              "inbuilt_model": false
            }
          ],
          "uid": "related_articles",
          "mandatory": false,
          "multiple": false,
          "non_localizable": false,
          "unique": false,
          "indexed": false,
          "inbuilt_model": false
        },
        {
          "data_type": "global_field",
          "display_name": "SEO",
          "reference_to": "seo",
          "field_metadata": {
            "description": ""
          },
          "uid": "seo",
          "mandatory": false,
          "multiple": false,
          "non_localizable": false,
          "unique": false,
          "indexed": false,
          "inbuilt_model": false
        }
      ],
      "options": {
        "is_page": true,
        "singleton": false,
        "sub_title": [],
        "title": "title",
        "url_pattern": "/:title",
        "url_prefix": "/article/"
      },
      "created_by": "bltce9401ba486d3c23",
      "updated_by": "bltce9401ba486d3c23",
      "created_at": "2024-11-30T03:52:14.855Z",
      "updated_at": "2024-11-30T03:54:29.605Z",
      "deleted_at": false,
      "description": "",
      "_version": 5,
      "field_rules": []
    },
    "environment": {
      "urls": [
        {
          "locale": "en",
          "url": "https://compass-starter---blt6e39cdfaac-production.contentstackapps.com/en"
        },
        {
          "locale": "fr",
          "url": "https://compass-starter---blt6e39cdfaac-production.contentstackapps.com/fr"
        },
        {
          "locale": "de",
          "url": "https://compass-starter---blt6e39cdfaac-production.contentstackapps.com/de"
        },
        {
          "locale": "es",
          "url": "https://compass-starter---blt6e39cdfaac-production.contentstackapps.com/es"
        }
      ],
      "name": "production",
      "_version": 2,
      "api_key": "blt6e39cdfaac74824c",
      "org_uid": "blte5beeb2edad1d61a",
      "uid": "blt78bb9fab298c6744",
      "created_by": "bltce9401ba486d3c23",
      "updated_by": "bltce9401ba486d3c23",
      "created_at": "2024-11-30T03:50:51.656Z",
      "updated_at": "2024-11-30T03:58:41.754Z"
    },
    "branch": {
      "api_key": "blt6e39cdfaac74824c",
      "org_uid": "blte5beeb2edad1d61a",
      "uid": "main",
      "source": "",
      "created_by": "bltce9401ba486d3c23",
      "updated_by": "bltce9401ba486d3c23",
      "created_at": "2024-11-30T03:50:41.195Z",
      "updated_at": "2024-11-30T03:50:41.195Z",
      "alias": []
    }
  },
  "triggered_at": "2024-12-19T21:30:01.521Z"
}