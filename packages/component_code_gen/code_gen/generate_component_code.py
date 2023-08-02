from dotenv import load_dotenv
load_dotenv()

import helpers.langchain_helpers as langchain_helpers
import helpers.supabase_helpers as supabase_helpers

import config.logging_config as logging_config
logger = logging_config.getLogger(__name__)


def main(app, prompt, templates):
    db = supabase_helpers.SupabaseConnector()

    docs_meta = db.get_app_docs_meta(app)

    try:
        if 'docs_url' in docs_meta:
            contents = db.get_docs_contents(app)
            if contents:
                docs =  { row['url']: row['content'] for row in contents }
                return with_docs(app, prompt, docs, 'api reference', templates)
    except Exception as e:
        logger.error(e)
        logger.error("failed with docs")

    try:
        if 'openapi_url' in docs_meta:
            contents = db.get_openapi_contents(app)
            if contents:
                docs = { row['path']: row['content'] for row in contents }
                return with_docs(app, prompt, docs, 'openapi', templates)
    except Exception as e:
        logger.error(e)
        logger.error("failed with openapi")

    return no_docs(app, prompt, templates)


def no_docs(app, prompt, templates):
    logger.debug('no docs, calling openai directly')

    return langchain_helpers.no_docs(app, prompt, templates)


def with_docs(app, prompt, docs, docs_type, templates):
    logger.debug(f"using {docs_type} docs")

    result = langchain_helpers.ask_agent(prompt, docs, templates)

    if result != "I don't know":
        return result

    logger.debug("trying again without docs")
    return no_docs(app, prompt, templates)
