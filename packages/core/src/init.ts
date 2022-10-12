import type { Component } from '#type/component'
import { initLifecycle } from './lifecycle'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './event'

export function initMixin(Vue: Component) {
  Vue.prototype._init = function init(options?: Record<string, any>) {
    const vm: Component = this

    if (options) {
      // 便于获取传入的选项
      vm.$options = options
    }
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    // 初始化状态 props methods data computed watch
    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
