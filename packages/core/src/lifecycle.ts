import { Component } from '#type/component'
export function lifecycleMixin(Vue: Component) {
  Vue.prototype._update = function () {}
  Vue.prototype.$forceUpdate = function () {}
  Vue.prototype.$destory = function () {}
}
export function initLifecycle(vm: Component) {}

