import type { Component } from '#type/component'
import { defaultStrat, strats } from '@vue/globalApi'
import { set } from '@vue/observe'
import { extend, hasOwn, isPlainObject } from './index'

/**
 * 合并对象
 *
 * 对于 data：组件中的数据优先
 *
 * 对于 methods，components，directives：合并成一个对象，key 重复时，组件的优先
 *
 * 对于 hooks：合并成一个数组，混入对象的 hook 在组件自身的 hook 之前执行
 *
 * @param parent 父对象
 * @param child 子对象
 * @param vm 实例
 * @returns Object
 */
export function mergeOptions(
  parent: Record<string, any>,
  child: Record<string, any>,
  vm?: Component
) {
  const options = {}
  //
  for (const key in parent) {
    mergeField(key)
  }

  for (const key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField(key: any) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

/**
 * 合并 hooks
 * @param parent
 * @param child
 * @returns Array<Function> | null
 */
export function mergeLifeCycleHook(
  parent: Array<Function> | null,
  child: Array<Function> | Function | null
) {
  let res: Array<Function> | null
  if (child) {
    // child 存在
    if (parent) {
      // parent 存在
      res = parent.concat(child) // 合并成数组，并且 parent 中的值在前
    } else if (Array.isArray(child)) {
      res = child
    } else {
      res = [child]
    }
  } else {
    // child 不存在时，直接用 parent
    res = parent
  }
  return res ? dedupeHooks(res) : res
}

/**
 * hooks 去重
 * @param hooks
 * @returns Array<Function>
 */
function dedupeHooks(hooks: Array<Function>) {
  return Array.from(new Set(hooks))
}

/**
 * 处理对象的合并
 * @param to object
 * @param from object ｜ null
 * @returns to
 */
function mergeData(to: Record<string, any>, from: Record<string, any> | null) {
  if (!from) {
    return to
  }
  const keys = Object.keys(from)
  let toVal, fromVal
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    // ？？暂时不知道这里为啥要这么处理
    if (key === '__ob__') {
      continue
    }
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      // 当 to 中没有时，添加访问器属性（响应式）
      set(to, key, fromVal)
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      // 递归处理 为对象的值
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * 合并 data 对象或函数
 * @param parent
 * @param child
 * @param vm
 * @returns Function｜object
 */
export function mergeDataOrFn(parent: any, child: any, vm?: Component) {
  if (!vm) {
    // Vue.mixin 混入时，没有 vm，所以是混入到全局 options
    if (!child) {
      return parent
    }
    if (!parent) {
      return child
    }
    // 作为 data 函数调用
    return function mergeDataFn() {
      return mergeData(
        typeof child === 'function' ? child.call(this, this) : child,
        typeof parent === 'function' ? parent.call(this, this) : parent
      )
    }
  } else {
    // 在实例中混入时，混入到实例的 options 上
    // 作为 data 函数调用
    return function mergeInstanceDataFn() {
      const instanceData =
        typeof child === 'function' ? child.call(vm, vm) : child
      const defaultData =
        typeof parent === 'function' ? parent.call(vm, vm) : parent

      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

/**
 * 合并 components filters directives
 * @param parent
 * @param child
 * @param vm
 * @param key
 * @returns
 */
export function mergeAsset(
  parent: Object | null,
  child: Object | null,
  vm: Component | null,
  key: string
): Object {
  const res = Object.create(parent || null)
  if (child) {
    return extend(res, child)
  } else {
    return res
  }
}

/**
 * 合并 watch，因为不能重写，需要将相同 key 对应的处理转换为数组
 * @param parent
 * @param child
 * @param vm
 * @param key
 */
export function mergeWatch(
  parent: Record<string, any>,
  child: Record<string, any>,
  vm: Component,
  key: string
): Object {
  if (!child) {
    return Object.create(parent || null)
  }
  if (!parent) {
    return child
  }
  const res: Record<string, any> = {}
  extend(res, parent)
  for (const key in child) {
    let _parent = res[key]
    const _child = child[key]

    if (_parent && !Array.isArray(_parent)) {
      _parent = [_parent]
    }
    res[key] = _parent
      ? _parent.concat(_child)
      : Array.isArray(_child)
      ? _child
      : [_child]
  }
  return res
}

/**
 * 合并 props methods computed inject
 * @param parent
 * @param child
 * @param vm
 * @param key
 */
export function mergeOther(
  parent: Object | null,
  child: Object | null,
  vm: Component | null,
  key: string
): Object | null {
  if (!parent) {
    return child
  }
  const res = Object.create(null)
  // 复制 parent 对象的 key-value 到 结果对象中
  extend(res, parent)
  if (child) {
    // child 存在时，将 child 对象中的 key-value 复制到 结果对象中，当与 parent 对象中有相同 key 时，以 child 中的 key-value 为准
    extend(res, child)
  }
  return res
}
