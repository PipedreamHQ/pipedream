<template><h1 id="python" tabindex="-1"><a class="header-anchor" href="#python" aria-hidden="true">#</a> Python</h1>
<p><strong>Anything you can do in Python can be done in a Pipedream Workflow</strong>. This includes using any of the <a href="https://pypi.org/" target="_blank" rel="noopener noreferrer">350,000+ PyPi packages available<ExternalLinkIcon/></a> in your Python powered workflows.</p>
<p>Pipedream supports <a href="https://www.python.org" target="_blank" rel="noopener noreferrer">Python v{{$site.themeConfig.PYTHON_VERSION}}<ExternalLinkIcon/></a> in workflows.</p>
<div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>Python steps are available in a limited alpha release.</p>
<p>You can still run arbitrary Python code, including <a href="/code/python/#sharing-data-between-steps" target="_blank" rel="noopener noreferrer">sharing data between steps<ExternalLinkIcon/></a> as well as <a href="/code/python/#using-environment-variables" target="_blank" rel="noopener noreferrer">accessing environment variables<ExternalLinkIcon/></a>.</p>
<p>However, you can't connect accounts, return HTTP responses, or take advantage of other features available in the <a href="/code/nodejs" target="_blank" rel="noopener noreferrer">Node.js<ExternalLinkIcon/></a> environment at this time. If you have any questions please <a href="https://pipedream.com/support" target="_blank" rel="noopener noreferrer">contact support<ExternalLinkIcon/></a>.</p>
</div>
<h2 id="adding-a-python-code-step" tabindex="-1"><a class="header-anchor" href="#adding-a-python-code-step" aria-hidden="true">#</a> Adding a Python code step</h2>
<ol>
<li>Click the + icon to add a new step</li>
<li>Click <strong>Custom Code</strong></li>
<li>In the new step, select the <code>python</code> language runtime in language dropdown</li>
</ol>
<h2 id="logging-and-debugging" tabindex="-1"><a class="header-anchor" href="#logging-and-debugging" aria-hidden="true">#</a> Logging and debugging</h2>
<p>You can use <code>print</code> at any time in a Python code step to log information as the script is running.</p>
<p>The output for the <code>print</code> <strong>logs</strong> will appear in the <code>Results</code> section just beneath the code editor.</p>
<div>
<img alt="Python print log output in the results" src="@source/code/python/images/print-logs.png">
</div>
<h2 id="using-third-party-packages" tabindex="-1"><a class="header-anchor" href="#using-third-party-packages" aria-hidden="true">#</a> Using third party packages</h2>
<p>You can use any packages from <a href="https://pypi.org" target="_blank" rel="noopener noreferrer">PyPi<ExternalLinkIcon/></a> in your Pipedream workflows. This includes popular choices such as:</p>
<ul>
<li><a href="https://pypi.org/project/requests/" target="_blank" rel="noopener noreferrer"><code>requests</code> for making HTTP requests<ExternalLinkIcon/></a></li>
<li><a href="https://pypi.org/project/sqlalchemy/" target="_blank" rel="noopener noreferrer"><code>sqlalchemy</code>for retrieving or inserting data in a SQL database<ExternalLinkIcon/></a></li>
<li><a href="https://pypi.org/project/pandas/" target="_blank" rel="noopener noreferrer"><code>pandas</code> for working with complex datasets<ExternalLinkIcon/></a></li>
</ul>
<p>To use a PyPi package, just include it in your step's code:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> requests
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>And that's it.</p>
<p>No need to update a <code>requirements.txt</code> or specify elsewhere in your workflow of which packages you need. Pipedream will automatically install the dependency for you.</p>
<h2 id="making-an-http-request" tabindex="-1"><a class="header-anchor" href="#making-an-http-request" aria-hidden="true">#</a> Making an HTTP request</h2>
<p>We recommend using the popular <code>requests</code> HTTP client package available in Python to send HTTP requests.</p>
<p>No need to run <code>pip install</code>, just <code>import requests</code> at the top of your step's code and it's available for your code to use.</p>
<h3 id="making-a-get-request" tabindex="-1"><a class="header-anchor" href="#making-a-get-request" aria-hidden="true">#</a> Making a <code>GET</code> request</h3>
<p>GET requests typically are for retrieving data from an API. Below is an example.</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> requests

url <span class="token operator">=</span> <span class="token string">'https://swapi.dev/api/people/1'</span>

r <span class="token operator">=</span> requests<span class="token punctuation">.</span>get<span class="token punctuation">(</span>url<span class="token punctuation">)</span>

<span class="token comment"># The response is logged in your Pipedream step results:</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span>text<span class="token punctuation">)</span>

<span class="token comment"># The response status code is logged in your Pipedream step results:</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span>status<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h3 id="making-a-post-request" tabindex="-1"><a class="header-anchor" href="#making-a-post-request" aria-hidden="true">#</a> Making a POST request</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> requests

<span class="token comment"># This a POST request to this URL will echo back whatever data we send to it</span>
url <span class="token operator">=</span> <span class="token string">'https://postman-echo.com/post'</span>

data <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"name"</span><span class="token punctuation">:</span> <span class="token string">"Bulbasaur"</span><span class="token punctuation">}</span>

r <span class="token operator">=</span> requests<span class="token punctuation">.</span>post<span class="token punctuation">(</span>url<span class="token punctuation">,</span> data<span class="token punctuation">)</span>

<span class="token comment"># The response is logged in your Pipedream step results:</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span>text<span class="token punctuation">)</span>

<span class="token comment"># The response status code is logged in your Pipedream step results:</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span>status<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h3 id="sending-files" tabindex="-1"><a class="header-anchor" href="#sending-files" aria-hidden="true">#</a> Sending files</h3>
<p>You can also send files within a step.</p>
<p>An example of sending a previously stored file in the workflow's <code>/tmp</code> directory:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># Retrieving a previously saved file from workflow storage</span>
files <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">'image'</span><span class="token punctuation">:</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">'/tmp/python-logo.png'</span><span class="token punctuation">,</span> <span class="token string">'rb'</span><span class="token punctuation">)</span><span class="token punctuation">}</span>

r <span class="token operator">=</span> requests<span class="token punctuation">.</span>post<span class="token punctuation">(</span>url<span class="token operator">=</span><span class="token string">'https://api.imgur.com/3/image'</span><span class="token punctuation">,</span> files<span class="token operator">=</span>files<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="sharing-data-between-steps" tabindex="-1"><a class="header-anchor" href="#sharing-data-between-steps" aria-hidden="true">#</a> Sharing data between steps</h2>
<p>A step can accept data from other steps in the same workflow, or pass data downstream to others.</p>
<h3 id="using-data-from-another-step" tabindex="-1"><a class="header-anchor" href="#using-data-from-another-step" aria-hidden="true">#</a> Using data from another step</h3>
<p>In Python steps, data from the initial workflow trigger and other steps are available in the <code>pipedream.script_helpers.export</code> module.</p>
<p>In this example, we'll pretend this data is coming into our HTTP trigger via POST request.</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"id"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Bulbasaur"</span><span class="token punctuation">,</span>
  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"plant"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>In our Python step, we can access this data in the <code>exports</code> variable from the <code>pipedream.script_helpers</code> module. Specifically, this data from the POST request into our workflow is available in the <code>trigger</code> dictionary item.</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">from</span> pipedream<span class="token punctuation">.</span>script_helpers <span class="token keyword">import</span> <span class="token punctuation">(</span>steps<span class="token punctuation">,</span> export<span class="token punctuation">)</span>

<span class="token comment"># retrieve the data points from the HTTP request in the initial workflow trigger </span>
name <span class="token operator">=</span> steps<span class="token punctuation">[</span><span class="token string">"trigger"</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">"event"</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">"name"</span><span class="token punctuation">]</span>
pokemon_type <span class="token operator">=</span> steps<span class="token punctuation">[</span><span class="token string">"trigger"</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">"event"</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token string">"type"</span><span class="token punctuation">]</span>

<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"</span><span class="token interpolation"><span class="token punctuation">{</span>pokemon_name<span class="token punctuation">}</span></span><span class="token string"> is a </span><span class="token interpolation"><span class="token punctuation">{</span>pokemon_type<span class="token punctuation">}</span></span><span class="token string"> type Pokemon"</span></span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="sending-data-downstream-to-other-steps" tabindex="-1"><a class="header-anchor" href="#sending-data-downstream-to-other-steps" aria-hidden="true">#</a> Sending data downstream to other steps</h3>
<p>To share data created, retrieved, transformed or manipulated by a step to others downstream call the <code>export</code> module from <code>pipedream.script_helpers</code>.</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token comment"># This step is named "code" in the workflow</span>
<span class="token keyword">from</span> pipedream<span class="token punctuation">.</span>script_helpers <span class="token keyword">import</span> <span class="token punctuation">(</span>steps<span class="token punctuation">,</span> export<span class="token punctuation">)</span>

r <span class="token operator">=</span> requests<span class="token punctuation">.</span>get<span class="token punctuation">(</span><span class="token string">"https://pokeapi.co/api/v2/pokemon/charizard"</span><span class="token punctuation">)</span>
<span class="token comment"># Store the JSON contents into a variable called "pokemon"</span>
pokemon <span class="token operator">=</span> r<span class="token punctuation">.</span>json<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token comment"># Expose the pokemon data downstream to others steps in the "pokemon" key from this step</span>
export<span class="token punctuation">(</span><span class="token string">'pokemon'</span><span class="token punctuation">,</span> pokemon<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>Now this <code>pokemon</code> data is accessible to downstream steps within <code>steps[&quot;code&quot;][&quot;pokemon&quot;]</code></p>
<div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>Not all data types can be stored in the <code>steps</code> data shared between workflow steps.</p>
<p>For the best experience, we recommend only exporting these types of data from Python steps:</p>
<ul>
<li>lists</li>
<li>dictionaries</li>
</ul>
<p><a href="/workflows/steps/#limitations-on-step-exports" target="_blank" rel="noopener noreferrer">Read more details on step limitations here.<ExternalLinkIcon/></a></p>
</div>
<h2 id="using-environment-variables" tabindex="-1"><a class="header-anchor" href="#using-environment-variables" aria-hidden="true">#</a> Using environment variables</h2>
<p>You can leverage any <a href="/environment-variables/#environment-variables" target="_blank" rel="noopener noreferrer">environment variables defined in your Pipedream account<ExternalLinkIcon/></a> in a Python step. This is useful for keeping your secrets out of code as well as keeping them flexible to swap API keys without having to update each step individually.</p>
<p>To access them, use the <code>os</code> module.</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> os
<span class="token keyword">import</span> requests

token <span class="token operator">=</span> os<span class="token punctuation">.</span>environ<span class="token punctuation">[</span><span class="token string">'TWITTER_API_KEY'</span><span class="token punctuation">]</span>

<span class="token keyword">print</span><span class="token punctuation">(</span>token<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>Or an even more useful example, using the stored environment variable to make an authenticated API request.</p>
<h3 id="using-api-key-authentication" tabindex="-1"><a class="header-anchor" href="#using-api-key-authentication" aria-hidden="true">#</a> Using API key authentication</h3>
<p>If an particular service requires you to use an API key, you can pass it via the headers of the request.</p>
<p>This proves your identity to the service so you can interact with it:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> requests
<span class="token keyword">import</span> os

token <span class="token operator">=</span> os<span class="token punctuation">.</span>environ<span class="token punctuation">[</span><span class="token string">'TWITTER_API_KEY'</span><span class="token punctuation">]</span>

url <span class="token operator">=</span> <span class="token string">'https://api.twitter.com/2/users/@pipedream/mentions'</span>

headers <span class="token punctuation">{</span> <span class="token string">'Authorization'</span><span class="token punctuation">:</span> <span class="token string-interpolation"><span class="token string">f"Bearer </span><span class="token interpolation"><span class="token punctuation">{</span>token<span class="token punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">}</span>
r <span class="token operator">=</span> requests<span class="token punctuation">.</span>get<span class="token punctuation">(</span>url<span class="token punctuation">,</span> headers<span class="token operator">=</span>headers<span class="token punctuation">)</span>

<span class="token keyword">print</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span>text<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>There are 2 different ways of using the <code>os</code> module to access your environment variables.</p>
<p><code>os.environ['ENV_NAME_HERE']</code> will raise an error that stops your workflow if that key doesn't exist in your Pipedream account.</p>
<p>Whereas <code>os.environ.get('ENV_NAME_HERE')</code> will <em>not</em> throw an error and instead returns an empty string.</p>
<p>If your code relies on the presence of a environment variable, consider using <code>os.environ['ENV_NAME_HERE']</code> instead.</p>
</div>
<h2 id="handling-errors" tabindex="-1"><a class="header-anchor" href="#handling-errors" aria-hidden="true">#</a> Handling errors</h2>
<p>You may need to exit a workflow early. In a Python step, just a <code>raise</code> an error to halt a step's execution.</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">raise</span> NameError<span class="token punctuation">(</span><span class="token string">'Something happened that should not. Exiting early.'</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>All exceptions from your Python code will appear in the <strong>logs</strong> area of the results.</p>
<h2 id="file-storage" tabindex="-1"><a class="header-anchor" href="#file-storage" aria-hidden="true">#</a> File storage</h2>
<p>You can also store and read files with Python steps. This means you can upload photos, retrieve datasets, accept files from an HTTP request and more.</p>
<p>The <code>/tmp</code> directory is accessible from your workflow steps for saving and retrieving files.</p>
<p>You have full access to read and write both files in <code>/tmp</code>.</p>
<h3 id="writing-a-file-to-tmp" tabindex="-1"><a class="header-anchor" href="#writing-a-file-to-tmp" aria-hidden="true">#</a> Writing a file to /tmp</h3>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> requests

<span class="token comment"># Download the Python logo</span>
r <span class="token operator">=</span> requests<span class="token punctuation">.</span>get<span class="token punctuation">(</span><span class="token string">'https://www.python.org/static/img/python-logo@2x.png'</span><span class="token punctuation">)</span>

<span class="token comment"># Create a new file python-logo.png in the /tmp/data directory</span>
<span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">'/tmp/python-logo.png'</span><span class="token punctuation">,</span> <span class="token string">'wb'</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
  <span class="token comment"># Save the content of the HTTP response into the file</span>
  f<span class="token punctuation">.</span>write<span class="token punctuation">(</span>r<span class="token punctuation">.</span>content<span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>Now <code>/tmp/python-logo.png</code> holds the official Python logo.</p>
<h3 id="reading-a-file-from-tmp" tabindex="-1"><a class="header-anchor" href="#reading-a-file-from-tmp" aria-hidden="true">#</a> Reading a file from /tmp</h3>
<p>You can also open files you have previously stored in the <code>/tmp</code> directory. Let's open the <code>python-logo.png</code> file.</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> os

<span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">'/tmp/python-logo.png'</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
  <span class="token comment"># Store the contents of the file into a variable</span>
  file_data <span class="token operator">=</span> f<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="listing-files-in-tmp" tabindex="-1"><a class="header-anchor" href="#listing-files-in-tmp" aria-hidden="true">#</a> Listing files in /tmp</h3>
<p>If you need to check what files are currently in <code>/tmp</code> you can list them and print the results to the <strong>Logs</strong> section of <strong>Results</strong>:</p>
<div class="language-python ext-py line-numbers-mode"><pre v-pre class="language-python"><code><span class="token keyword">import</span> os

<span class="token comment"># Prints the files in the tmp directory</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>listdir<span class="token punctuation">(</span><span class="token string">'/tmp'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>The <code>/tmp</code> directory does not have unlimited storage. Please refer to the <a href="/limits/#disk" target="_blank" rel="noopener noreferrer">disk limits<ExternalLinkIcon/></a> for details.</p>
</div>
</template>
