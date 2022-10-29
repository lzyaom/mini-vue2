import { initExtend } from './extend'
import { initMixin } from './mixin'
import { initUse } from './use'
export function iniGlobalApi(Vue) {
  Vue.options = Object.create(null)
  initExtend(Vue)
  initMixin(Vue)
  initUse(Vue)
}
