import type { Component } from '#type/component'

export function renderMixin(Vue: Component) {
  Vue.prototype._render = function () {
  }

export function initRender(vm: Component) {
}
