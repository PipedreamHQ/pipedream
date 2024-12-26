export default {
  "module": "entry",
  "api_key": "blt6e39cdfaac74824c",
  "data": {
    "entry": {
      "title": "test article",
      "url": "/article/test-article",
      "cover_image": {
        "uid": "blt81f45c9d5c3103de",
        "created_at": "2024-12-19T20:55:53.701Z",
        "updated_at": "2024-12-19T20:55:53.701Z",
        "created_by": "cs52122cc4ac22f20e",
        "updated_by": "cs52122cc4ac22f20e",
        "content_type": "image/jpeg",
        "file_size": "463713",
        "tags": [],
        "filename": "george.jpg",
        "url": "https://images.contentstack.io/v3/assets/blt6e39cdfaac74824c/blt81f45c9d5c3103de/67648859989c5367eed4ffdb/george.jpg",
        "ACL": [],
        "is_dir": false,
        "parent_uid": null,
        "_version": 1,
        "title": "george.jpg"
      },
      "summary": "Summary",
      "taxonomies": [],
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
      "show_related_links": false,
      "related_links": {
        "text": "Related Links"
      },
      "show_related_articles": false,
      "related_articles": {
        "heading": "Related Headline",
        "sub_heading": "Related Subhead",
        "number_of_articles": 6
      },
      "seo": {
        "title": "Title",
        "description": "Description",
        "canonical_url": "/",
        "no_index": true,
        "no_follow": true
      },
      "tags": [],
      "locale": "en",
      "uid": "blt6b0da76c39f34851",
      "created_by": "cs52122cc4ac22f20e",
      "updated_by": "cs52122cc4ac22f20e",
      "created_at": "2024-12-19T21:29:49.303Z",
      "updated_at": "2024-12-19T21:29:49.303Z",
      "ACL": {},
      "_version": 1,
      "_in_progress": false
    },
    "content_type": {
      "created_at": "2024-11-30T03:52:14.855Z",
      "created_by": "bltce9401ba486d3c23",
      "updated_at": "2024-11-30T03:54:29.605Z",
      "updated_by": "bltce9401ba486d3c23",
      "title": "Article",
      "uid": "article",
      "description": "",
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
          "inbuilt_model": false,
          "schema": [
            {
              "data_type": "text",
              "display_name": "Title",
              "uid": "title",
              "field_metadata": {
                "description": "Please add the SEO title of the page.",
                "default_value": "Title",
                "placeholder": "Title",
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
              "display_name": "Description",
              "uid": "description",
              "field_metadata": {
                "description": "Please enter the SEO description of the page.",
                "default_value": "Description",
                "multiline": true,
                "placeholder": "Description",
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
              "display_name": "Canonical URL",
              "uid": "canonical_url",
              "field_metadata": {
                "description": "Please add the canonical url of the page.",
                "default_value": "/",
                "placeholder": "Canonical URL",
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
              "data_type": "boolean",
              "display_name": "No index",
              "uid": "no_index",
              "field_metadata": {
                "description": "Please check if the value is no index",
                "default_value": true
              },
              "mandatory": false,
              "multiple": false,
              "non_localizable": false,
              "unique": false,
              "indexed": false,
              "inbuilt_model": false
            },
            {
              "data_type": "boolean",
              "display_name": "No follow",
              "uid": "no_follow",
              "field_metadata": {
                "description": "Please check if the value is no follow.",
                "default_value": true
              },
              "mandatory": false,
              "multiple": false,
              "non_localizable": false,
              "unique": false,
              "indexed": false,
              "inbuilt_model": false
            }
          ]
        }
      ],
      "options": {
        "is_page": true,
        "singleton": false,
        "sub_title": [],
        "title": "title",
        "url_pattern": "/:title",
        "url_prefix": "/article/"
      }
    },
    "branch": {
      "uid": "main",
      "source": "",
      "alias": []
    }
  },
  "event": "create",
  "triggered_at": "2024-12-19T21:29:49.441Z"
}