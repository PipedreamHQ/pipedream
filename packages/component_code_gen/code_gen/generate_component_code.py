import config.logging_config as logging_config
import helpers.langchain_helpers as langchain_helpers
import helpers.supabase_helpers as supabase_helpers
from dotenv import load_dotenv
load_dotenv()


def main(app, prompt):
    logger = logging_config.getLogger(__name__)

    use_docs = False
    db = supabase_helpers.SupabaseConnector()
    app_docs = db.get_app_docs(app)

    if app_docs is None:
        return langchain_helpers.no_docs(app, prompt)

    if app_docs['docs_url']:
        contents = db.get_docs_contents(app)
        if contents:
            docs =  { row['url']: row['content'] for row in contents }
            logger.debug("using api reference docs")
            use_docs = True

    elif app_docs['openapi_url']:
        contents = db.get_openapi_contents(app)
        if contents:
            docs = { row['path']: row['content'] for row in contents }
            logger.debug("using openapi docs")
            use_docs = True

    if use_docs:
        result = langchain_helpers.ask_agent(prompt, docs)
        if result == "I don't know":
            logger.debug("trying again without docs")
            result = langchain_helpers.no_docs(app, prompt)
    else:
        result = langchain_helpers.no_docs(app, prompt)

    return result
