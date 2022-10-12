import { def, hasOwn, isObject } from '@vue/shared'
import { arrayMethods } from './array'
import { Dep } from './dep'

/**
 * Observer
 */
export class Observer {
  dep: Dep
  value: any

  constructor(value: any) {
    this.dep = new Dep() // 给每个对象都增加收集功能
    this.value = value

    // 给数据加一个标识，如果有 __ob__ 表示被观测过；定义为不可枚举，否则会导致内存泄漏（在 defineReactive 内调用 observe 方法创建 Observer 对象导致无限循环）
    // value.__ob__ = this
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      // 重写数组的 7 个可修改数组本身的方法
      // push pop unshift shift sort reverse splice
      protoAugment(value, arrayMethods)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  /**
   * 循环定义访问器属性
   * @param data 对象
   */
  walk(data: any) {
    // 重新定义了属性，导致性能很差
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
  }
  /**
   * 观测数组中的对象
   * @param value 数组
   */
  observeArray(value: Array<any>) {
    // 劫持数组中的每一个对象
    value.forEach((item) => observe(item))
  }
}

function protoAugment(target, src) {
  target.__proto__ = src
}

export function observe(value: any): Observer | undefined {
  // 只对对象进行劫持
  if (!isObject(value)) {
    return
  }
  if (value.__ob__ instanceof Observer) {
    // 如果已被代理则直接返回
    return value.__ob__
  }
  return new Observer(value)
}
/**
 * 为对象中的属性重新定义数据属性，实现响应式
 * 是一个闭包，get/set 函数中会使用外部变量
 * @param target
 * @param key
 * @param value
 */
export function defineReactive(target: object, key: string, value?: any) {
  const dep = new Dep() // 每个属性都有一个 dep
  // value 可能为多层对象，需要迭代劫持每个对象中的属性
  const oldDep = observe(value)
  Object.defineProperty(target, key, {
    set: function reactiveSetter(newValue) {
      // 值没变直接返回
      if (value === newValue) {
        return
      }
      console.log(`修改了 ${key} 的值，从`, value, '->', newValue)
      // 设置值
      value = newValue
      // 如果传入的值是一个对象，需要再次劫持
      observe(newValue)
      // 通知
      dep.notify()
    },
    get: function reactiveGetter() {
      // 取值
      if (Dep.target) {
        dep.depend() // 这个属性的收集器记住这个 watcher
        // key 的值为非基本类型
        if (oldDep) {
          oldDep.dep.depend() // 让数组或对象本身也实现依赖收集
          // 如果当前值是一个数组，需要收集依赖，以便 watcher 更新
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      console.log(`访问了 ${key} 的值`)
      return value
    },
  })
}
/**
 * 响应式添加或修改属性
 * @param target
 * @param key
 * @param value
 */
export function set(
  target: Record<string, any> | Array<any>,
  key: any,
  value: any
) {
  if (Array.isArray(target)) {
    // 修改数组中元素的值时，调用封装的 splice 方法
    target.splice(key, 1, value)
    return value
  }
  // 对象
  // 属性存在时，直接设置值并返回
  if (hasOwn(target, key)) {
    target[key] = value
    return value
  }
  // key 不存在时
  const ob = target.__ob__
  // 非响应式对象
  if (!ob) {
    target[key] = value
    return value
  }
  defineReactive(target, key as string, value)
  ob.dep.notify()
  return value
}
/**
 * 响应式删除属性
 * @param target
 * @param key
 */
export function del(target: Record<string, any> | Array<any>, key: any) {
  if (Array.isArray(target)) {
    // 数组 使用 splice
    target.splice(key, 1)
    return
  }
  // 属性不存在时
  if (!hasOwn(target, key)) {
    return
  }
  // 对象使用 delete
  delete target[key]
  const ob = target.__ob__
  // 非响应式对象
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/**
 * 当对象是一个数组时，在修改数组本身的元素时，需要收集依赖
 * @param value
 */
function dependArray(value: Array<any>) {
  for (let i = 0, len = value.length; i < len; i++) {
    const e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    // 如果当前值还是数组，仍然获取需要收集依赖
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
