import os
import json
import requests
import markdown_to_json
import config.logging_config as logging_config
from code_gen.generate import main

logger = logging_config.getLogger(__name__)


def generate(issue_number, output_dir, verbose=False, tries=3):
    # parse github issue description
    md = requests.get(
        f"https://api.github.com/repos/PipedreamHQ/pipedream/issues/{issue_number}").json()["body"].lower()
    description = markdown_to_json.dictify(md)
    app = list(description.keys())[0]
    requirements = []
    global_urls = []

    for h2_header in description[app]:
        if h2_header == "urls":
            global_urls += description[app][h2_header]
            continue

        for component_key in description[app][h2_header]:
            component_data = description[app][h2_header][component_key]
            instructions = component_data["description"]
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
