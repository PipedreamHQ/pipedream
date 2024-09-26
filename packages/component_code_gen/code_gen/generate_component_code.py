import json
import config.logging_config as logging_config
import helpers.supabase_helpers as supabase_helpers
import helpers.langchain_helpers as langchain_helpers
from templates import generate_actions, generate_webhook_sources, generate_polling_sources, generate_apps

from dotenv import load_dotenv
load_dotenv()


logger = logging_config.getLogger(__name__)


def generate_qa_checks(component_type):
    checks_mapping = {
        'action': generate_actions.checks,
        'webhook_source': generate_webhook_sources.checks,
        'polling_source': generate_polling_sources.checks,
        'app': generate_apps.checks,
    }

    always_include_mapping = {
        'action': generate_actions.always_include,
        'webhook_source': generate_webhook_sources.always_include,
        'polling_source': generate_polling_sources.always_include,
        'app': generate_apps.always_include,
    }

    return {
        'checks': checks_mapping[component_type],
        'always_include': always_include_mapping[component_type],
    }


def generate_code(app, prompt, templates, parsed_common_files, urls_content, tries):
    db = supabase_helpers.SupabaseConnector()
    # docs_meta = db.get_app_docs_meta(app)
    docs_meta = {}  # XXX - temporarily disable supabase docs
    results = []

    auth_details = "## Auth details\n\nThese details come directly from the app configuration in Pipedream. Prioritize this information over any other information you find in the app's docs, since this section is specific to Pipedream."
    auth_meta = db.get_app_auth_meta(app)
    auth_type = auth_meta.get('auth_type')
    if auth_type == "keys":
        custom_fields = json.loads(auth_meta.get('custom_fields_json', '[]'))
        custom_fields_text = ", ".join([o["name"] for o in custom_fields])
        auth_details += f"{app} is a key-based app. `this.{app}.$auth` is an object with properties for each custom field: {custom_fields_text}. When you make an API request, use the format from the \"Auth example\" section below."
    elif auth_type == "oauth":
        auth_details += f"{app} is an OAuth app. The `this` object exposes the OAuth access token in the variable `this.#{app.name_slug}.$auth.oauth_access_token`. When you make an API request, use the format from the \"Auth example\" section below."
    if auth_meta.get('component_code_scaffold_raw'):
        auth_details = f"\n\n## Auth example\n\nHere's example Node.js code to show how authentication is done in {app}:\n\n{auth_meta['component_code_scaffold_raw']}\n\n"

    normal_order = False
    for i in range(tries):
        logger.debug(f'Attempt {i+1} of {tries}')
        normal_order = not normal_order

        # Initialize a flag to track if we obtained any results with docs
        has_docs_result = False

        if 'docs_url' in docs_meta:
            contents = db.get_docs_contents(app)
            if contents:
                docs = {row['url']: row['content'] for row in contents}
                results.append(call_langchain(
                    prompt, templates, auth_details, parsed_common_files, urls_content, docs, 'api reference', normal_order=normal_order))
                has_docs_result = True

        if 'openapi_url' in docs_meta:
            contents = db.get_openapi_contents(app)
            if contents:
                docs = {row['path']: row['content'] for row in contents}
                results.append(call_langchain(
                    prompt, templates, auth_details, parsed_common_files, urls_content, docs, 'openapi', normal_order=normal_order))
                has_docs_result = True

        # If we haven't obtained any results using docs
        if not has_docs_result:
            results.append(call_langchain(prompt, templates,
                           auth_details, parsed_common_files, urls_content, normal_order=normal_order))

    # Create a new prompt string
    new_prompt = "I've asked other GPT agents to generate the following code based on the prompt and the instructions below. One set of code (or all) may not follow the rules laid out in the prompt or in the instructions below, so you'll need to review it for accuracy. Try to evaluate the examples according to the rules, combine the best parts of each example, and generate a final set of code that solves the problem posed by the prompt and follows all of the rules below.\n\nThis is important for my career. You better be sure of your answers.\n\nHere are the attempts + code:\n\n---\n\n"
    for idx, result in enumerate(results, 1):
        new_prompt += f"Try {idx}:\n\n${result}\n\n---\n\n"
    new_prompt += f"---\n\n{prompt}"

    # Call the model again with the new prompt to get the final result
    logger.debug(f"Calling the model a final time to summarize the attempts")
    return call_langchain(new_prompt, templates, auth_details)


def call_langchain(prompt, templates, auth_details, parsed_common_files="", urls_content=[], docs=None, docs_type=None, attempts=0, max_attempts=3, normal_order=True):
    logger.debug(f"Calling LangChain")
    # If we don't have docs, or if we can't reach OpenAI to get the parsed docs
    if not docs:
        return langchain_helpers.no_docs(prompt, templates, auth_details, parsed_common_files, urls_content, normal_order)

    if attempts >= max_attempts:
        logger.debug('Max attempts reached, calling the model directly')
        return langchain_helpers.no_docs(prompt, templates, auth_details, urls_content, normal_order)

    # else if we have docs, call the model with docs
    logger.debug(f"Using {docs_type} docs")

    result = langchain_helpers.ask_agent(
        prompt, docs, templates, auth_details, parsed_common_files, urls_content)

    if result != "I don't know":
        return result

    logger.debug("Trying again without docs")
    return call_langchain(prompt, templates, auth_details, parsed_common_files, urls_content, attempts=attempts+1, normal_order=normal_order)
