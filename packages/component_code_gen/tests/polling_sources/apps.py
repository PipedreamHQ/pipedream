apps = [
    {
        'app': 'a123formbuilder',
        'instructions': 'how to emit events for every new form submission',
        'key': 'a123formbuilder-form-response-submitted',
        'common-files': [
            'a123formbuilder/a123formbuilder.app.mjs',
            'a123formbuilder/sources/common/base.mjs',
        ],
    },
    {
        'app': 'bigml',
        'instructions': 'how to emit events for every new model created',
        'key': 'bigml-new-model-created',
        'common-files': [
            'bigml/bigml.app.mjs',
            'bigml/common/constants.mjs',
            'bigml/sources/common/base.mjs',
        ],
    },
    {
        'app': 'coda',
        'instructions': 'how to emit events for every created or updated row',
        'key': 'coda-new-row-created',
        'common-files': [
            'coda/coda.app.mjs',
        ],
    },
    {
        'app': 'docusign',
        'instructions': 'how to emit events when an envelope status is set to sent or complete',
        'key': 'docusign-envelope-sent-or-complete',
        'common-files': [
            'docusign/docusign.app.mjs',
            'docusign/sources/envelope-sent-or-complete/common.mjs',
        ],
    },
    {
        'app': 'drata',
        'instructions': 'how to emit events whenever a monitor fails',
        'key': 'drata-failed-monitor',
        'common-files': [
            'drata/drata.app.mjs',
        ],
    },
    {
        'app': 'faunadb',
        'instructions': 'how to emit events each time you add or remove a document from a specific collection',
        'key': 'faunadb-changes-to-collection',
        'common-files': [
            'faunadb/faunadb.app.mjs',
        ],
    },
    {
        'app': 'here',
        'instructions': 'how to emit weather reports for a specific zip code on a schedule',
        'key': 'here-weather-for-zip',
        'common-files': [
            'here/here.app.mjs',
        ],
    },
    {
        'app': 'hubspot',
        'instructions': 'how to emit events for each new deal created',
        'key': 'hubspot-new-deal',
        'common-files': [
            'hubspot/hubspot.app.mjs',
            'hubspot/sources/common/common.mjs',
        ],
    },
    {
        'app': 'intercom',
        'instructions': 'how to emit events each time a user replies to a conversation',
        'key': 'intercom-new-user-reply',
        'common-files': [
            'intercom/intercom.app.mjs',
            'intercom/sources/common.mjs',
        ],
    },
    {
        'app': 'mailchimp',
        'instructions': 'how to emit events when a recipient clicks a pre-specified link in an specific campaign',
        'key': 'mailchimp-link-clicked',
        'common-files': [
            'mailchimp/mailchimp.app.mjs',
            'mailchimp/sources/common/timer-based.mjs',
            'mailchimp/sources/common/base.mjs',
        ],
    },
    {
        'app': 'monday',
        'instructions': 'how to emit events when a new board is created in Monday',
        'key': 'monday-new-board',
        'common-files': [
            'monday/monday.app.mjs',
            'monday/sources/common/common-polling.mjs',
        ],
    },
    {
        'app': 'notion',
        'instructions': 'how to emit events when a page in a database is updated',
        'key': 'notion-updated-page-in-database',
        'common-files': [
            'notion/notion.app.mjs',
            'notion/sources/common/constants.mjs',
            'notion/sources/common/base.mjs',
        ],
    },
    {
        'app': 'raindrop',
        'instructions': 'how to emit events when a bookmark is added',
        'key': 'raindrop-new-bookmark',
        'common-files': [
            'raindrop/raindrop.app.mjs',
            'raindrop/common/constants.mjs',
        ],
    },
    {
        'app': 'supabase',
        'instructions': 'how to emit events for every new row added in a table',
        'key': 'supabase-new-row-added',
        'common-files': [
            'supabase/supabase.app.mjs',
            'supabase/common/constants.mjs',
            'supabase/sources/common/base.mjs',
        ],
    },
]
