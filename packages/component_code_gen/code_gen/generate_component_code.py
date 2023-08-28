import config.logging_config as logging_config
from config.config import config
import helpers.supabase_helpers as supabase_helpers
import helpers.langchain_helpers as langchain_helpers
from dotenv import load_dotenv
load_dotenv()


logger = logging_config.getLogger(__name__)


def generate_code(app, prompt, templates, tries):
    results = []
    db = supabase_helpers.SupabaseConnector()

    for i in range(tries):
        logger.debug(f'Attempt {i+1} of {tries}')
        validate_inputs(app, prompt, templates, tries)

        auth_meta = db.get_app_auth_meta(app)
        # TODO: is this needed only for actions?
        add_code_example(templates, auth_meta['component_code_scaffold_raw'])

        docs_meta = db.get_app_docs_meta(app)
        # Initialize a flag to track if we obtained any results with docs
        has_docs_result = False

        if 'docs_url' in docs_meta:
            contents = db.get_docs_contents(app)
            if contents:
                docs = {row['url']: row['content'] for row in contents}
                results.append(call_langchain(
                    app, prompt, templates, docs, 'api reference'))
                has_docs_result = True

        if 'openapi_url' in docs_meta:
            contents = db.get_openapi_contents(app)
            if contents:
                docs = {row['path']: row['content'] for row in contents}
                results.append(call_langchain(
                    app, prompt, templates, docs, 'openapi'))
                has_docs_result = True

        # If we haven't obtained any results using docs
        if not has_docs_result:
            results.append(call_langchain(app, prompt, templates))

    # Create a new prompt string
    new_prompt = "I've asked other GPT agents to generate the following code based on the prompt and the instructions below. One set of code (or all) may not follow the rules laid out in the prompt or in the instructions below, so you'll need to review it for accuracy. Try to evaluate the examples according to the rules, combine the best parts of each example, and generate a final set of code that solves the problem posed by the prompt and follows all of the rules below. Here are the attempts + code:\n\n---\n\n"
    for idx, result in enumerate(results, 1):
        new_prompt += f"Try {idx}:\n\n${result}\n\n---\n\n"
    logger.debug(f"\n\n---------------{new_prompt}\n\n")
    new_prompt += "---\n\n" + prompt

    # Call the model again with the new prompt to get the final result
    logger.debug(f"Calling the model a final time to summarize the attempts")
    return call_langchain(app, new_prompt, templates)


def call_langchain(app, prompt, templates, docs=None, docs_type=None, attempts=0, max_attempts=3):
    logger.debug(f"Calling langchain")
    # If we don't have docs, or if we can't reach OpenAI to get the parsed docs
    if not docs:
        logger.debug('No docs available, calling the model directly')
        return langchain_helpers.no_docs(app, prompt, templates)

    if attempts >= max_attempts:
        logger.debug('Max attempts reached, calling the model directly')
        return langchain_helpers.no_docs(app, prompt, templates)

    # else if we have docs, call the model with docs
    logger.debug(f"Using {docs_type} docs")

    result = langchain_helpers.ask_agent(prompt, docs, templates)

    if result != "I don't know":
        return result

    logger.debug("Trying again without docs")
    return call_langchain(app, prompt, templates, attempts=attempts+1)


def add_code_example(templates, example):
    return templates.no_docs_system_instructions % example


def validate_inputs(app, prompt, templates, tries):
    assert app and type(app) == str
    assert prompt and type(prompt) == str
    assert tries and type(tries) == int
    assert templates.no_docs_user_prompt
    assert templates.no_docs_system_instructions
    assert templates.with_docs_system_instructions
    assert templates.suffix
    assert templates.format_instructions
