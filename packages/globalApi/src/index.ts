import { initExtend } from './extend'
import { initMixin } from './mixin'
import { initUse } from './use'
export { strats, defaultStrat } from './strat'

export function iniGlobalApi(Vue) {
  Vue.options = Object.create(null)
  initExtend(Vue)
  initMixin(Vue)
  initUse(Vue)
}
