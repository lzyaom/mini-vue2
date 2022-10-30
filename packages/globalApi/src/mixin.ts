import { mergeOptions } from '@vue/shared'

export function initMixin(Vue) {
  /**
   * 将传入的对象 混入 到全局 options
   * @param mixin
   * @returns
   */
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
