import { Component } from '#type/component'
import { Watcher } from '@vue/observe'
import { VNode, patch } from '@vue/vdom'

export function lifecycleMixin(Vue: Component) {
  Vue.prototype._update = function (vnode: VNode) {
    const vm: Component = this
    // 创建标签 和 diff
    const preVnode = vm._vnode
    vm._vnode = vnode
    if (!preVnode) {
      // 初始渲染时，没有虚拟节点，做替换原来元素的操作
      vm.$el = patch(vm.$el, vnode)
    } else {
      // 原虚拟节点存在，且有更新时，需要替换变动的元素和属性，diff 算法
      vm.$el = patch(preVnode, vnode)
    }
  }
  Vue.prototype.$forceUpdate = function () {}
  Vue.prototype.$destory = function () {}
}
export function initLifecycle(vm: Component) {}

/**
 * 挂载组件
 * @param vm
 * @param el
 */
export function mountComponent(vm: Component, el: Element | null) {
  vm.$el = el
  const update = () => {
    // 1. 调用 render 方法产生 虚拟DOM
    const vnode: VNode = vm._render()
    console.log(vnode)
    // 2. 根据虚拟DOM 产生真实DOM
    vm._update(vnode)
    // 3. 插入到 el 元素中
  }
  new Watcher(vm, update, () => {}, {})
}
