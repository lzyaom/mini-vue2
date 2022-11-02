import type { Component } from '#type/component'
import { GlobalAPI } from '#type/global-api'
import { defineComputed, proxy } from '@vue/core'
import { mergeOptions } from '@vue/shared'

export function initExtend(Vue: GlobalAPI) {
  Vue.cid = 0
  let cid = 1

  Vue.extend = function (extendOptions: any): typeof Component {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid

    // 寄生组合式继承
    const Sub = function VueComponent(this: any, options: any) {
      this._init(options)
    } as unknown as typeof Component
    //
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub

    Sub.cid = cid++
    Sub.options = mergeOptions(Super.options, extendOptions)
    Sub['super'] = Super

    if (Sub.options.props) {
      initProps(Sub)
    }

    if (Sub.options.computed) {
      initComputed(Sub)
    }

    Sub.extend = Super.extend
    Sub.use = Super.use
    Sub.mixin = Super.mixin

    return Sub
  }
}

function initProps(component: typeof Component) {
  const props = component.options.props
  for (const key in props) {
    proxy(component.prototype, '_props', key)
  }
}

function initComputed(Comp: typeof Component) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
