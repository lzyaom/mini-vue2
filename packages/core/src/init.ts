import type { Component } from '#type/component'
import { callHook, initLifecycle } from './lifecycle'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './event'
import { mergeOptions } from '@vue/shared'

export function initMixin(Vue: Component) {
  Vue.prototype._init = function init(options?: Record<string, any>) {
    const vm: Component = this

    if (options) {
      // 便于获取传入的选项
      // 从全局 options 中的属性 混入到 实例的 options 中
      vm.$options = mergeOptions(this.constructor.options, options, vm)
    }
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    // 初始化状态 props methods data computed watch
    initState(vm)

    callHook(vm, 'created')
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
