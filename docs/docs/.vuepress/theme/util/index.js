export const hashRE = /#.*$/
export const extRE = /\.(md|html)$/
export const endingSlashRE = /\/$/
export const outboundRE = /^(https?:|mailto:|tel:)/

const normalizedMap = new Map()

export function normalize (path) {
  if (normalizedMap.has(path)) {
    return normalizedMap.get(path)
  }
  const result = decodeURI(path)
    .replace(hashRE, '')
    .replace(extRE, '')
  normalizedMap.set(path, result)
  return result
}

export function getHash (path) {
  const match = path.match(hashRE)
  if (match) {
    return match[0]
  }
}

export function isExternal (path) {
  return outboundRE.test(path)
}

export function isMailto (path) {
  return /^mailto:/.test(path)
}

export function isTel (path) {
  return /^tel:/.test(path)
}

export function ensureExt (path) {
  if (isExternal(path)) {
    return path
  }
  const hashMatch = path.match(hashRE)
  const hash = hashMatch ? hashMatch[0] : ''
  const normalized = normalize(path)

  if (endingSlashRE.test(normalized)) {
    return path
  }
  return normalized + '.html' + hash
}

export function isActive (route, path) {
  const routeHash = route.hash
  const linkHash = getHash(path)
  if (linkHash && routeHash !== linkHash) {
    return false
  }
  const routePath = normalize(route.path)
  const pagePath = normalize(path)
  return routePath === pagePath
}

export function resolvePage (pages, rawPath, base) {
  if (!resolvePage.cache) {
    resolvePage.cache = new Map()
    pages.forEach((page, i) => {
      resolvePage.cache.set(normalize(page.regularPath), i)
    })
  }
  if (isExternal(rawPath)) {
    return {
      type: 'external',
      path: rawPath
    }
  }
  if (base) {
    rawPath = resolvePath(rawPath, base)
  }
  const path = normalize(rawPath)
  const cache = resolvePage.cache
  if (cache.has(path)) {
    const page = pages[cache.get(path)]
    return Object.assign({}, page, {
      type: 'page',
      path: ensureExt(page.path)
    })
  }
  console.error(`[vuepress] No matching page found for sidebar item "${rawPath}"`)
  return {}
}

function resolvePath (relative, base, append) {
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

/**
 * @param { Page } page
 * @param { string } regularPath
 * @param { SiteData } site
 * @param { string } localePath
 * @returns { SidebarGroup }
 */
export function resolveSidebarItems (page, regularPath, site, localePath, versions) {
  const { pages } = site
  let themeConfig = site.themeConfig

  let localeConfig = localePath && themeConfig.locales
    ? themeConfig.locales[localePath] || themeConfig
    : themeConfig
  if (page.version && page.version !== 'next') {
    const versionedConfig = site.themeConfig.versionedSidebar && site.themeConfig.versionedSidebar[page.version]
    localeConfig = localePath && versionedConfig.locales
      ? versionedConfig.locales[localePath] || versionedConfig
      : versionedConfig
    themeConfig = versionedConfig
  }

  const pageSidebarConfig = page.frontmatter.sidebar || localeConfig.sidebar || themeConfig.sidebar
  if (pageSidebarConfig === 'auto') {
    return resolveHeaders(page)
  }

  const sidebarConfig = localeConfig.sidebar || themeConfig.sidebar
  if (!sidebarConfig) {
    return []
  } else {
    const { base, config } = resolveMatchingConfig(regularPath, sidebarConfig)
    if (config === 'auto') {
      return resolveHeaders(page)
    }
    return config
      ? config.map(item => resolveItem(item, pages, base))
      : []
  }
}

/**
 * @param { Page } page
 * @returns { SidebarGroup }
 */
function resolveHeaders (page) {
  const headers = groupHeaders(page.headers || [])
  return [{
    type: 'group',
    collapsable: false,
    title: page.title,
    path: null,
    children: headers.map(h => ({
      type: 'auto',
      title: h.title,
      basePath: page.path,
      path: page.path + '#' + h.slug,
      children: h.children || []
    }))
  }]
}

export function groupHeaders (headers) {
  // group h3s under h2
  headers = headers.map(h => Object.assign({}, h))
  let lastH2
  headers.forEach(h => {
    if (h.level === 2) {
      lastH2 = h
    } else if (lastH2) {
      (lastH2.children || (lastH2.children = [])).push(h)
    }
  })
  return headers.filter(h => h.level === 2)
}

export function resolveNavLinkItem (linkItem) {
  return Object.assign(linkItem, {
    type: linkItem.items && linkItem.items.length ? 'links' : 'link'
  })
}

export function versionifyUserNav (navConfig, currentPage, currentVersion, localePath, routes) {
  return navConfig.map(item => {
    // assign item to new object so we don't override the original values
    item = Object.assign({}, item)
    if (item.items) {
      item.items = versionifyUserNav(item.items, currentPage, currentVersion, localePath, routes)
    } else {
      let link = item.link
      if (currentPage.version !== currentVersion) {
        const cleanPath = item.link.replace(new RegExp(`^${localePath}`), '')
        link = `${localePath}${currentPage.version}/${cleanPath}`
        if (!routes.some(route => route.path === link)) {
          // Fallback to the un-altered default link
          link = item.link
        }
      }
      item.link = link
    }

    return Object.assign({}, item)
  })
}

/**
 * @param { Route } route
 * @param { Array<string|string[]> | Array<SidebarGroup> | [link: string]: SidebarConfig } config
 * @returns { base: string, config: SidebarConfig }
 */
export function resolveMatchingConfig (regularPath, config) {
  if (Array.isArray(config)) {
    return {
      base: '/',
      config: config
    }
  }
  for (const base in config) {
    if (ensureEndingSlash(regularPath).indexOf(base) === 0) {
      return {
        base,
        config: config[base]
      }
    }
  }
  return {}
}

function ensureEndingSlash (path) {
  return /(\.html|\/)$/.test(path)
    ? path
    : path + '/'
}

function resolveItem (item, pages, base, groupDepth = 1) {
  if (typeof item === 'string') {
    return resolvePage(pages, item, base)
  } else if (Array.isArray(item)) {
    return Object.assign(resolvePage(pages, item[0], base), {
      title: item[1]
    })
  } else {
    const children = item.children || []
    if (children.length === 0 && item.path) {
      return Object.assign(resolvePage(pages, item.path, base), {
        title: item.title
      })
    }
    return {
      type: 'group',
      path: item.path,
      title: item.title,
      sidebarDepth: item.sidebarDepth,
      children: children.map(child => resolveItem(child, pages, base, groupDepth + 1)),
      collapsable: item.collapsable !== false
    }
  }
}

export function calculateCurrentAnchor (sidebarLinks) {
  const anchors = [].slice
    .call(document.querySelectorAll('.header-anchor'))
    .filter(anchor => sidebarLinks.some(sidebarLink => sidebarLink.hash === anchor.hash))
    .map(el => {
      return {
        el,
        hash: decodeURIComponent(el.hash),
        top: el.getBoundingClientRect().top - 120
      }
    })
  if (anchors.length === 0) {
    return null
  }
  const l = anchors.length
  if (anchors[0].top > 0 && anchors[0].top < 10) {
    return anchors[0]
  }

  if (anchors[l - 1].top < 0) {
    return anchors[l - 1]
  }

  for (let i = 0; i < l; i++) {
    const anchor = anchors[i]
    const nextAnchor = anchors[i + 1]
    if (anchor.top < 0 && nextAnchor.top > 0) {
      if (nextAnchor.top < 10) {
        return nextAnchor
      }
      return anchor
    }
  }

  return anchors[0]
}
