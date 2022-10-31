import {
  ASSET_TYPE,
  LIFECYCLE_HOOKS,
  mergeAsset,
  mergeDataOrFn,
  mergeLifeCycleHook,
  mergeOther,
  mergeWatch,
} from '@vue/shared'
/**
 * 策略模式
 */
type Strat = { [key: string]: Function }
export const strats: Strat = {}

LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeLifeCycleHook
})

ASSET_TYPE.forEach((type) => {
  strats[type + 's'] = mergeAsset
})

strats['provide'] = mergeDataOrFn

strats['data'] = mergeDataOrFn

strats['watch'] = mergeWatch

strats['props'] =
  strats['methods'] =
  strats['inject'] =
  strats['computed'] =
    mergeOther

strats['el'] = defaultStrat

export function defaultStrat(parent: any, child: any, vm: any, key: any) {
  return child || parent
}
