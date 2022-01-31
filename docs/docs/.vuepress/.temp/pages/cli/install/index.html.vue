<template><h1 id="installing-the-cli" tabindex="-1"><a class="header-anchor" href="#installing-the-cli" aria-hidden="true">#</a> Installing the CLI</h1>
<nav class="table-of-contents"><ul><li><RouterLink to="#macos">macOS</RouterLink></li><li><RouterLink to="#linux">Linux</RouterLink></li><li><RouterLink to="#windows-native">Windows (native)</RouterLink></li><li><RouterLink to="#windows-wsl">Windows (WSL)</RouterLink></li><li><RouterLink to="#cli-builds">CLI Builds</RouterLink></li></ul></nav>
<h2 id="macos" tabindex="-1"><a class="header-anchor" href="#macos" aria-hidden="true">#</a> macOS</h2>
<p>Run the following command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://cli.pipedream.com/install <span class="token operator">|</span> <span class="token function">sh</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>This will automatically download and install the <code>pd</code> CLI to your Mac. You can also <a href="https://cli.pipedream.com/darwin/amd64/latest/pd.zip" target="_blank" rel="noopener noreferrer">download the macOS build<ExternalLinkIcon/></a>, unzip that archive, and place the <code>pd</code> binary somewhere in <a href="https://opensource.com/article/17/6/set-path-linux" target="_blank" rel="noopener noreferrer">your <code>PATH</code><ExternalLinkIcon/></a>.</p>
<p>If this returns a permissions error, you may need to run:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://cli.pipedream.com/install <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">sh</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="linux" tabindex="-1"><a class="header-anchor" href="#linux" aria-hidden="true">#</a> Linux</h2>
<p>Download the <a href="#cli-builds">CLI build</a> for your architecture below. Unzip that archive, and place the <code>pd</code> binary somewhere in <a href="https://opensource.com/article/17/6/set-path-linux" target="_blank" rel="noopener noreferrer">your <code>PATH</code><ExternalLinkIcon/></a>.</p>
<h2 id="windows-native" tabindex="-1"><a class="header-anchor" href="#windows-native" aria-hidden="true">#</a> Windows (native)</h2>
<p><a href="https://cli.pipedream.com/windows/amd64/latest/pd.zip" target="_blank" rel="noopener noreferrer">Download the CLI build for Windows<ExternalLinkIcon/></a>. Unzip that archive, save <code>pd.exe</code> in Program Files, and <a href="https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/" target="_blank" rel="noopener noreferrer">add its file path to <code>Path</code> in your system environment variables<ExternalLinkIcon/></a>. Use <code>pd.exe</code> in a terminal that supports ANSI colors, like the <a href="https://github.com/microsoft/terminal" target="_blank" rel="noopener noreferrer">Windows Terminal<ExternalLinkIcon/></a>.</p>
<h2 id="windows-wsl" tabindex="-1"><a class="header-anchor" href="#windows-wsl" aria-hidden="true">#</a> Windows (WSL)</h2>
<p>Download the appropriate <a href="#cli-builds">Linux CLI build</a> for your architecture. Unzip that archive, and place the <code>pd</code> binary somewhere in <a href="https://opensource.com/article/17/6/set-path-linux" target="_blank" rel="noopener noreferrer">your <code>PATH</code><ExternalLinkIcon/></a>.</p>
<h2 id="cli-builds" tabindex="-1"><a class="header-anchor" href="#cli-builds" aria-hidden="true">#</a> CLI Builds</h2>
<p>Pipedream publishes the following builds of the CLI. If you need to use the CLI on another OS or architecture, <a href="https://docs.pipedream.com/support/" target="_blank" rel="noopener noreferrer">please reach out<ExternalLinkIcon/></a>.</p>
<table>
<thead>
<tr>
<th>Operating System</th>
<th>Architecture</th>
<th>link</th>
</tr>
</thead>
<tbody>
<tr>
<td>Linux</td>
<td>amd64</td>
<td><a href="https://cli.pipedream.com/linux/amd64/latest/pd.zip" target="_blank" rel="noopener noreferrer">download<ExternalLinkIcon/></a></td>
</tr>
<tr>
<td>Linux</td>
<td>386</td>
<td><a href="https://cli.pipedream.com/linux/386/latest/pd.zip" target="_blank" rel="noopener noreferrer">download<ExternalLinkIcon/></a></td>
</tr>
<tr>
<td>Linux</td>
<td>arm</td>
<td><a href="https://cli.pipedream.com/linux/arm/latest/pd.zip" target="_blank" rel="noopener noreferrer">download<ExternalLinkIcon/></a></td>
</tr>
<tr>
<td>Linux</td>
<td>arm64</td>
<td><a href="https://cli.pipedream.com/linux/arm64/latest/pd.zip" target="_blank" rel="noopener noreferrer">download<ExternalLinkIcon/></a></td>
</tr>
<tr>
<td>macOS</td>
<td>amd64</td>
<td><a href="https://cli.pipedream.com/darwin/amd64/latest/pd.zip" target="_blank" rel="noopener noreferrer">download<ExternalLinkIcon/></a></td>
</tr>
<tr>
<td>Windows</td>
<td>amd64</td>
<td><a href="https://cli.pipedream.com/windows/amd64/latest/pd.zip" target="_blank" rel="noopener noreferrer">download<ExternalLinkIcon/></a></td>
</tr>
</tbody>
</table>
<p>Run <code>pd</code> to see a list of all commands, or <code>pd help &lt;command&gt;</code> to display help docs for a specific command.</p>
<p>See the <a href="/cli/reference/" target="_blank" rel="noopener noreferrer">CLI reference<ExternalLinkIcon/></a> for detailed usage and examples for each command.</p>
<Footer />
</template>
