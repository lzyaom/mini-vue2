import { Component } from '#type/component'
import { defineReactive, del, Dep, observe, set, Watcher } from '@vue/observe'
import { hasOwn, invokeErrorWithHandling, isPlainObject } from '@vue/shared'

export function stateMixin(Vue: Component) {
  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  //创建 watcher，
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: Function,
    options?: Record<string, any>
  ) {
    options = options || {}
    options.user = true
    const watcher = new Watcher(this, expOrFn, cb, options)
    if (options.immediate) {
      invokeErrorWithHandling(cb, this, [watcher.value], this, '')
    }
  }
}

export function initState(vm: Component) {
  const opts = vm.$options
  if (opts.props) {
    initProps(vm, opts.props)
  }
  if (opts.methods) {
    initMethods(vm, opts.methods)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm, opts.computed)
  }
  if (opts.watch) {
    initWatch(vm, opts.watch)
  }
}

function initProps(vm: Component, propsOptions: Object) {
  const props = (vm._props = {})
  const propsData = vm.$options.propsData || {}
  for (const key in propsOptions) {
    defineReactive(props, key, propsData[key])
    if (!(key in vm)) {
      proxy(vm, '_props', key)
    }
  }
}

/**
 * 初始化 methods 对象中的方法
 * @param vm 组件实例
 * @param methods 方法集合
 */
function initMethods(vm: Component, methods: Object) {
  for (const key in methods) {
    const method = methods[key]
    vm[key] = typeof method !== 'function' ? () => {} : method.bind(vm)
  }
}

/**
 * 将数据从 sourceKey 中代理到 target 上，便于直接使用 target.key 获取或修改值
 * @param target 目标对象
 * @param sourceKey 原来的位置
 * @param key 属性名
 */
export function proxy(target: Object, sourceKey: string, key: string) {
  Object.defineProperty(target, key, {
    get() {
      return this[sourceKey][key]
    },
    set(newValue) {
      this[sourceKey][key] = newValue
    },
  })
}
/**
 * 初始化数据，并将数据代理到 vm 上以及劫持数据，实现响应式数据
 * @param vm 组件实例
 */
function initData(vm: Component) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm, vm) : data || {}
  const keys = Object.keys(data)
  const len = keys.length
  for (let i = 0; i < len; i++) {
    const key = keys[i]
    proxy(vm, '_data', key)
  }
  // 对数据进行劫持
  observe(data)
}

/**
 * 初始化计算属性
 * @param vm 组件实例
 * @param computed 用户自定义计算属性对象
 */
function initComputed(vm: Component, computed: Object) {
  const watchers = (vm._computedWatchers = Object.create(null))
  for (const key in computed) {
    if (hasOwn(computed, key)) {
      const compute = computed[key]

      // 函数或者对象形式
      const getter = typeof compute === 'function' ? compute : compute.get

      // 每个计算属性都会创建一个 watcher，便于收集依赖
      // lazy: true 表示 计算属性是延迟执行的
      //
      watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true })

      if (!(key in vm)) {
        defineComputed(vm, key, compute)
      }
    }
  }
}

const sharedPropertyDef = {
  get: () => {},
  set: () => {},
  configurable: true,
  enumerable: true,
}

/**
 * 将 计算属性 绑定到 vm 上
 * @param vm 组件实例
 * @param key 计算属性 key
 * @param compute 处理函数或对象
 */
export function defineComputed(vm, key, compute) {
  if (typeof compute === 'function') {
    sharedPropertyDef.get = createComputedGetter(key)
    sharedPropertyDef.set = () => {}
  } else {
    sharedPropertyDef.get = compute.get
    sharedPropertyDef.set = compute.set || (() => {})
  }
  // 将计算属性定义到组件实例上
  Object.defineProperty(vm, key, sharedPropertyDef)
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key]

    if (watcher.dirty) {
      // 求值后 dirty 变为 false，当依赖属性更新时修改为 true
      watcher.evaluate() // 取值时，依赖属性的 dep 会将这个 watcher 记住
    }
    // 计算属性的 watcher 出栈后，也要收集 上一层的 watcher
    if (Dep.target) {
      watcher.depend()
    }
    return watcher.value
  }
}
/**
 * 初始化用户自定义的 watch
 *
 * eg:
 *  1. "a[.b...]": function (val, oldValue) {}
 *  2. key: [handler1, handler2, ...]
 *  3. key: { handler, [immediate, deep] }
 * @param vm 组件实例
 * @param watch 用户自定义的 watch
 */
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    if (hasOwn(watch, key)) {
      const handler = watch[key]
      // key: [handler1, handler2]
      if (Array.isArray(handler)) {
        for (let i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i])
        }
      } else {
        // key: string | object | function
        createWatcher(vm, key, handler)
      }
    }
  }
}

/**
 * 创建 watcher，实质是调用 $watch 方法去
 * @param vm
 * @param expOrFn
 * @param handler
 * @param options
 * @returns
 */
function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  // key: { handler: fn, ...}
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  // key: 'method'（在 methods 中定义的方法）
  if (typeof handler === 'string') {
    handler = vm[handler]
  }

  // 本质还是调用 $watch
  return vm.$watch(expOrFn, handler, options)
}
