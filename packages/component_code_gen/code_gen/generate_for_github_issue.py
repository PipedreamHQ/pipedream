from collections import OrderedDict
import os
import json
import requests
import markdown_to_json
import config.logging_config as logging_config
from code_gen.generate import main

logger = logging_config.getLogger(__name__)


def extract_prompts(markdown_dict):
    prompts = []
    for key, value in markdown_dict.items():
        if key == "prompt":
            prompts.append(value)
        elif isinstance(value, (dict, OrderedDict)):
            prompts.extend(extract_prompts(value))
    return prompts


def get_all_docs_urls(markdown_dict):
    urls = []
    for key, value in markdown_dict.items():
        if key == "urls":
            urls.extend(value)
        elif isinstance(value, (dict, OrderedDict)):
            urls.extend(get_all_docs_urls(value))
    return urls


def generate_app_file_prompt(requirements, app_file_content):
    if app_file_content:
        return f"""Given the existing app file and the requirements below, generate an app file that provides propDefinitions and methods that solve the requirements:
## EXISTING APP FILE CODE

{requirements}

## REQUIREMENTS

{app_file_content}"""

    return f"""Generate an app file that provides propDefinitions and methods that solve the following requirements:
    
{requirements}"""


def generate(issue_number, output_dir, verbose=False, tries=3):
    # parse github issue description
    md = requests.get(
        f"https://api.github.com/repos/PipedreamHQ/pipedream/issues/{issue_number}").json()["body"].lower()
    markdown = markdown_to_json.dictify(md)
    app = list(markdown.keys())[0]
    global_urls = []
    requirements = []

    file_path = f"{output_dir}/{app}/{app}.app.mjs"

    # If the directory at file_path doesn't exist, create it
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # First, we want to read the contents of an existing app file or create a new one.
    # Check to see if the file at file_path exists. If it does, it will be used in the prompt below
    # and then overwritten with the new app file. If it doesnt, we'll generate a new app file
    app_file_content = None
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            logger.debug("Reading existing app file")
            app_file_content = f.read()
    else:
        logger.debug("No existing app file found, creating new one")

    app_file_instructions = generate_app_file_prompt(
        "\n\n".join(extract_prompts(markdown)), app_file_content)
    all_docs_urls = get_all_docs_urls(markdown)
    logger.debug("Generating app file")
    app_file_content = main("app",
                            app,
                            instructions=app_file_instructions,
                            tries=tries,
                            urls=all_docs_urls,
                            verbose=verbose)

    with open(file_path, 'w') as f:
        logger.debug("Writing app file")
        f.write(app_file_content)

    # Then we add requirements for each component
    for h2_header in markdown[app]:
        if h2_header == "urls":
            global_urls += markdown[app][h2_header]
            continue

        for component_key in markdown[app][h2_header]:
            component_data = markdown[app][h2_header][component_key]
            instructions = f"{component_data['prompt']}\n\nUse the methods and propDefinitions in this app file to solve the requirements: {app_file_content}"
            urls = component_data["urls"]

            if "source" in h2_header:
                component_type = "webhook_source" if "webhook" in h2_header else "polling_source"
            elif "action" in h2_header:
                component_type = "action"
            else:
                continue

            requirements.append({
                "type": component_type,
                "key": component_key,
                "instructions": f"The component key is {app}-{component_key}. {instructions}",
                "urls": global_urls + urls,
            })

    for component in requirements:
        logger.info(f"generating {component['key']}...")
        result = main(component["type"], app, component["instructions"], tries=tries,
                      urls=component["urls"], verbose=verbose)

        component_type = "sources" if "source" in component['type'] else "actions"

        file_path = f"{output_dir}/{app}/{component_type}/{component['key']}/{component['key']}.mjs"
        logger.info(f"writing output to {file_path}")

        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.write(result)
