import { Component } from '#type/component'
import { invokeErrorWithHandling } from '@vue/shared'
import { Dep, popTarget, pushTarget } from './dep'
import { queueWatcher } from './scheduler'

let id = 0

// 1. 当创建渲染 watcher 时，把当前的渲染 watcher 放到 Dep.target 上
// 2. 调用 _render() 会取值，走到 get 上
// 3. 每个属性有一个 dep（属性就是被观察者），watcher 就是观察者（属性变化了通知观察者来更新）-> 观察者模式

// 需要给每个属性增加一个 dep，目的是收集 watcher
// 一个组件（视图）中有多个属性，n 个 dep 对应一个 watcher
// 1 个属性 对应多个组件，1 个 dep 对应多个 watcher
// dep 和 watcher 是多对多的关系

/**
 * 观察者
 */
export class Watcher {
  // 不同的组件有不同的 watcher
  vm
  cb: Function
  options?: {
    user?: boolean
    lazy?: boolean
  }
  id: number
  getter: Function
  deps: Array<Dep> // 一个 watcher 对应多个 dep(每个属性对应一个 dep)，实现计算属性和清理工作
  depIds: Set<number>
  value: any
  lazy: boolean
  user: boolean
  dirty: boolean

  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options,
    isRenderWatch?: boolean
  ) {
    this.id = id++
    this.vm = vm
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = function getter() {
        const segments = expOrFn.split('.')
      }
    }
    this.cb = cb
    if (options) {
      this.lazy = !!options.lazy
      this.user = !!options.user
    } else {
      this.user = this.lazy = false
    }

    this.deps = []
    this.depIds = new Set()
    this.dirty = this.lazy

    this.value = this.lazy ? undefined : this.get()
  }

  get() {
    pushTarget(this)
    let value
    try {
      value = this.getter.call(this.vm, this.vm) // 取值，属性的 dep 收集 watcher
    } catch (error) {
      console.error(error)
    } finally {
      popTarget()
    }
    return value
  }

  update() {
    if (this.lazy) {
      // 计算属性
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }

  // 计算属性在取值时，需要执行 对应 watcher 的 get 方法，同时需要将 dirty 修改为 false
  // 只有依赖属性更新时，才将 dirty 设置为 true
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  run() {
    const value = this.get()
    if (value !== this.value) {
      if (this.user) {
        // 用户自定义的 watch，可以执行异步函数
        invokeErrorWithHandling(
          this.cb,
          this.vm,
          [value, this.value],
          this.vm,
          ''
        )
      } else {
        this.cb.apply(this.vm, [value, this.value])
      }
    }
  }

  addDep(dep: Dep) {
    // 一个组件对应多个属性，重复的属性不用记录
    const id = dep.id
    if (!this.depIds.has(id)) {
      // watcher 去重
      this.deps.push(dep)
      this.depIds.add(id)
      dep.addSub(this) // dep 记住 watcher
    }
  }

  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend() // 计算属性也收集
    }
  }
}
