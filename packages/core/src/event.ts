import { Component } from '#type/component'

export function eventMixin(Vue: Component) {
  Vue.prototype.$on = function (event: string, cb: Function) {}
  Vue.prototype.$once = function (event: string, cb: Function) {}
  Vue.prototype.$off = function (event: string, cb: Function) {}
  Vue.prototype.$emit = function (event: string, ...args: Array<any>) {}
}

export function initEvents(vm: Component) {}
