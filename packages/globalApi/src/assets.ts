import { ASSET_TYPE, isFunction, isPlainObject } from '@vue/shared'

export function initAssets(Vue) {
  // 定义 component filter directive 全局方法
  ASSET_TYPE.forEach((type) => {
    Vue[type] = function (id: string, definition?: Function | Object) {
      if (!definition) {
        // 定义对象不存在时，获取全局 options 下的全局属性的值
        return this.options[type + 's'][id]
      } else {
        if (type === 'component' && isPlainObject(definition)) {
          // @ts-expect-error
          definition.name = definition.name || id
          // 将组件对象转换为构造函数
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && isFunction(definition)) {
          definition = { bind: definition, update: definition }
        }
        // 定义到全局属性上
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
