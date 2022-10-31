import { ASSET_TYPE } from '@vue/shared'
import { initExtend } from './extend'
import { initMixin } from './mixin'
import { initUse } from './use'
export { strats, defaultStrat } from './strat'

export function iniGlobalApi(Vue) {
  Vue.options = Object.create(null)
  ASSET_TYPE.forEach((key) => {
    Vue.options[key + 's'] = Object.create(null)
  })
  Vue.options._base = Vue
  initExtend(Vue)
  initMixin(Vue)
  initUse(Vue)
}
