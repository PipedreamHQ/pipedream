import config.logging_config as logging_config
import helpers.langchain_helpers as langchain_helpers
import helpers.supabase_helpers as supabase_helpers
from dotenv import load_dotenv
load_dotenv()


def main(app, prompt):
    logger = logging_config.getLogger(__name__)

    use_docs = True
    db = supabase_helpers.SupabaseConnector()
    row = db.client.table('components').select('*').match({'app_name_slug': app}).execute().data[0]

    if row is None:
        return langchain_helpers.no_docs(app, prompt)

    if row['docs_url']:
        rows = db.client.table('api_reference_urls').select('url,content').neq('content', None).match({'app': app}).execute().data
        if len(rows or []) == 0:
            use_docs = False
        else:
            docs =  { row['url']: row['content'] for row in rows }
            logger.debug("using api reference docs")
    elif row['openapi_url']:
        rows = db.client.table('openapi_paths').select('path,content').match({'app': app}).neq('content', None).execute().data
        if len(rows or []) == 0:
            use_docs = False
        else:
            docs = { row['path']: row['content'] for row in rows }
            logger.debug("using openapi docs")
    else:
        use_docs = False

    if use_docs:
        result = langchain_helpers.ask_agent(prompt, docs)
        if result == "I don't know":
            logger.debug("trying again without docs")
            result = langchain_helpers.no_docs(app, prompt)
    else:
        result = langchain_helpers.no_docs(app, prompt)

    return result
