import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from config.config import config
import templates.generate_actions
import templates.generate_webhook_sources
import templates.generate_polling_sources
import templates.generate_apps


scraped_urls = {}
available_templates = {
    'action': templates.generate_actions,
    'webhook_source': templates.generate_webhook_sources,
    'polling_source': templates.generate_polling_sources,
    'app': templates.generate_apps,
}


def main(component_type, app, instructions, tries=3, urls=[], custom_path=None, verbose=False):
    if verbose:
        os.environ['LOGGING_LEVEL'] = 'DEBUG'

    validate_inputs(app, component_type, instructions, tries)

    templates = available_templates[component_type]
    parsed_common_files = parse_common_files(app, component_type, custom_path)
    urls_content = parse_urls(urls)

    validate_system_instructions(templates)

    # this is here so that the DEBUG environment variable is set before the import
    from code_gen.generate_component_code import generate_code
    result = generate_code(app, instructions, component_type, templates,
                           parsed_common_files, urls_content, tries)
    return result


def parse_common_files(app, component_type, custom_path=None):
    file_list = []
    app_path = custom_path or os.path.join('..', '..', 'components', app)

    if "source" in component_type:
        component_type = "source"

    for root, _, files in os.walk(app_path):
        for filename in files:
            filepath = os.path.join(root, filename)
            if "dist" in filepath or "node_modules" in filepath:
                continue
            if "actions" in filepath or "sources" in filepath:
                if component_type == "app":
                    continue
                elif component_type in filepath and "common" in filepath:
                    file_list.append(filepath)
            else:
                if filepath.endswith(".mjs") or filepath.endswith(".ts"):
                    file_list.append(filepath)

    parsed_common_files = ""
    for common_file in file_list:
        with open(common_file, 'r') as f:
            common_file = common_file.split(f"{app}{os.sep}")[1]
            parsed_common_files += f'### ../../{common_file}\n\n{f.read()}\n'
    return parsed_common_files


def parse_urls(urls):
    contents = []
    if len(urls) == 0:
        return contents

    if not config["browserless"]["api_key"]:
        raise Exception("Missing required browserless api key in config")

    # init browserless
    chrome_options = webdriver.ChromeOptions()
    chrome_options.set_capability(
        'browserless:token', config["browserless"]["api_key"])
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--headless")
    driver = webdriver.Remote(
        command_executor='https://chrome.browserless.io/webdriver',
        options=chrome_options
    )

    for url in urls:
        if url in scraped_urls:
            print(f"Already scraped {url}")
            contents.append({
                "url": url,
                "content": scraped_urls[url]["content"]
            })
            continue

        try:
            print(f"Scraping {url}")
            driver.get(url)
            time.sleep(2)  # loads js
            element = driver.find_element(By.TAG_NAME, 'body')
            content = {
                "url": url,
                "content": " ".join(element.text.split()),
            }
            contents.append(content)
            scraped_urls[url] = content
        except Exception as e:
            return {
                "url": url,
                "error": e,
            }

    driver.quit()
    return contents


def validate_inputs(app, component_type, instructions, tries):
    assert component_type in available_templates.keys(
    ), f'Templates for {component_type}s are not available. Please choose one of {list(available_templates.keys())}'
    assert app and type(app) == str
    assert instructions and type(instructions) == str
    assert tries and type(tries) == int


def validate_system_instructions(templates):
    assert templates.system_instructions
