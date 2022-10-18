import type { Component } from '#type/component'
import { nextTick, query, toString } from '@vue/shared'
import { compileToFunction } from '@vue/compiler'
import { mountComponent } from './lifecycle'
import { createElement } from '@vue/vdom'
import { createTextVNode } from '@vue/vdom'

export function renderMixin(Vue: Component) {
  Vue.prototype._v = createTextVNode
  Vue.prototype._s = toString
  Vue.prototype.$mount = function (el: string | Element) {
    el = query(el)
    const opts = this.$options
    // 当 render 函数不存在时，render > template > el
    // 当存在时，
    if (!opts.render) {
      let template = opts.template

      if (template) {
        // 以 # 开始，会被作为选择符，并使用匹配元素的 innerHTML 作为模版
        if (typeof template === 'string' && template.charAt(0) === '#') {
          template = query(template).innerHTML
        }
        //  else {

        // }
      } else if (el) {
        template = el.outerHTML
      }

      if (template) {
        const render = compileToFunction(template)
        opts.render = render
      }
    }
    return mountComponent(this, el)
  }

  Vue.prototype._render = function () {
    const vm: Component = this

    const { render } = vm.$options
    let vnode
    try {
      vnode = render.call(vm, vm.$createElement)
    } catch (error) {
      console.error(error)
    }
    return vnode
  }

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }
}

export function initRender(vm: Component) {
  vm._c = (tag, data) => createElement(tag, data)
}
