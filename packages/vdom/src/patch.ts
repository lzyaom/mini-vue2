import { isDef } from '@vue/shared'
import {
  appendChild,
  createElement,
  createText,
  insertBefore,
  nextSibling,
  parentNode,
  removeChild,
  setAttribute,
  tagName,
} from './dom'
import { VNode } from './vnode'

function createElm(vnode, insertVnodeQueue, parentElm?: any, refELm?: any) {
  const tag = vnode.tag
  // 标签存在
  if (isDef(tag)) {
    vnode.elm = createElement(tag, vnode)
    // 创建子元素
    createChildren(vnode, vnode.children, insertVnodeQueue)
    // 处理属性
    if (isDef(vnode.data)) {
      createProps(vnode)
    }
    // 插入元素
    insert(parentElm, vnode.elm, refELm)
  } else {
    // 文本
    vnode.elm = createText(vnode.text!)
    // 插入元素
    insert(parentElm, vnode.elm, refELm)
  }
}

function createProps(vnode) {
  const data = vnode.data
  const elm = vnode.elm
  const attrs = data.attrs

  for (const key in attrs) {
    if (key === 'style') {
      for (const name in attrs.style) {
        elm.style[name] = attrs.style[name]
      }
    } else {
      setAttribute(elm, key, attrs[key])
    }
  }
}

function createChildren(vnode, children, insertVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      createElm(children[i], insertVnodeQueue, vnode.elm, null)
    }
  } else {
    const text = createText(vnode.text)
    appendChild(vnode.elm, text)
  }
}

function insert(parent, elm, ref) {
  if (isDef(parent)) {
    if (isDef(ref) && parentNode(ref) === parent) {
      insertBefore(parent, elm, ref)
    } else {
      appendChild(parent, elm)
    }
  }
}

export function patch(preVnode, vnode) {
  const isRealEl = isDef(preVnode.nodeType)
  const insertVnodeQueue: any[] = []
  if (isRealEl) {
    preVnode = new VNode(
      tagName(preVnode).toLowerCase(),
      {},
      [],
      undefined,
      preVnode
    )
    // 是真实元素，则根据 vnode 创建元素
    const parentElm = parentNode(preVnode.elm)
    createElm(vnode, insertVnodeQueue, parentElm, nextSibling(preVnode.elm))
    // 移除原来的元素
    if (isDef(parentElm)) {
      removeChild(parentElm!, preVnode.elm)
    }
  } else {
    // 是虚拟节点，则 diff
  }
}
