const SCROLL_OFFSET = 75

// fork from vue-router@3.0.2
// src/util/scroll.js
function getElementPosition (el) {
  const docEl = document.documentElement
  const docRect = docEl.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

module.exports = ({ Vue, options, router }) => {
  router.options.scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
      return window.scrollTo({
        top: savedPosition.y - SCROLL_OFFSET,
        behavior: 'smooth'
      })
    } else if (from.path === to.path && to.hash) {
      if (Vue.$vuepress.$get('disableScrollBehavior')) {
        return
      }
      const targetAnchor = to.hash
      const targetName = targetAnchor.slice(1)
      const targetElement =
        document.getElementById(targetName) ||
        document.querySelector(`[name=${targetName}]`)
      if (targetElement) {
        return window.scrollTo({
          top: getElementPosition(targetElement).y - SCROLL_OFFSET,
          behavior: 'smooth'
        })
      }
    } else {
      const html = document.querySelector('html')
      html.style.scrollBehavior = 'auto'
      window.scrollTo({ top: 0 })
      html.style.scrollBehavior = ''
    }
  }
}
