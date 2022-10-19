import { isDef } from '@vue/shared'
import { createElement } from './dom'

export function patch(preVnode, vnode) {
  const isRealEl = isDef(preVnode.nodeType)
  const insertVnodeQueue: any[] = []
  if (isRealEl) {
    // 是真实元素，则根据 vnode 创建元素
    const parentElm = preVnode.parentNode

    createElement(vnode, insertVnodeQueue, parentElm)
  } else {
    // 是虚拟节点，则 diff
  }
}
