import { Component } from '#type/component'
export function stateMixin(Vue: Component) {
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
function proxy(target: Object, sourceKey: string, key: string) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key]
    },
    set(newValue) {
      target[sourceKey][key] = newValue
    },
  })
}
/**
 * 初始化数据，并将数据代理到 vm 上以及劫持数据，实现响应式数据
 * @param vm 组件实例
 */
function initData(vm: Component) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data || {}
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
}


/**
 * 将 计算属性 绑定到 vm 上
 * @param vm 组件实例
 * @param key 计算属性 key
 * @param compute 处理函数或对象
 */
function defineComputed(vm, key, compute) {
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
}
