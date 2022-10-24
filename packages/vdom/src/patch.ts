import { isDef, isUnDef } from '@vue/shared'
import {
  appendChild,
  createElement,
  createText,
  insertBefore,
  nextSibling,
  parentNode,
  removeChild,
  setAttribute,
  setContent,
  tagName,
} from './dom'
import { cloneVNode, VNode } from './vnode'

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

/**
 *
 * @param vnode
 */
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

/**
 *
 * @param vnode
 * @param children
 * @param insertVnodeQueue
 */
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

/**
 *
 * @param parent
 * @param elm
 * @param ref
 */
function insert(parent, elm, ref) {
  if (isDef(parent)) {
    if (isDef(ref) && parentNode(ref) === parent) {
      insertBefore(parent, elm, ref)
    } else {
      appendChild(parent, elm)
    }
  }
}
/**
 * 判断是否为相同节点
 * @param preVnode
 * @param vnode
 * @returns boolean
 */
function sameNode(preVnode, vnode) {
  return (
    preVnode.tag === vnode.tag &&
    preVnode.key === vnode.key &&
    isDef(preVnode.data) === isDef(vnode.data)
  )
}
/**
 * 新增节点
 * @param parentElm
 * @param refELm
 * @param vnodes
 * @param startIdx
 * @param endIdx
 */
function addVNodes(
  parentElm,
  refELm,
  vnodes,
  startIdx,
  endIdx,
  insertVnodeQueue
) {
  for (; startIdx < endIdx; startIdx++) {
    createElm(vnodes[startIdx], insertVnodeQueue, parentElm, refELm)
  }
}
/**
 * 移除节点
 * @param vnodes
 * @param startIdx
 * @param endIdx
 */
function removeVNodes(vnodes, startIdx, endIdx) {}

/**
 * 创建 Map<key, index>
 * @param vnodes
 * @param startIdx
 * @param endIdx
 * @returns
 */
function createKeyToIdxMap(vnodes, startIdx, endIdx) {
  const keyToidxMap = {}
  for (; startIdx <= endIdx; startIdx++) {
    keyToidxMap[vnodes[startIdx].key] = startIdx
  }
  return keyToidxMap
}

/**
 * 更新子节点（diff 算法重点）
 * @param parentElm
 * @param oldCh
 * @param newch
 */
function patchChildren(parentElm, oldCh, newCh, insertVnodeQueue) {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newStartIdx = 0
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
    if (isUnDef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (isUnDef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameNode(oldStartVnode, newStartVnode)) {
      // 头头
      patchVnode(oldStartVnode, newStartVnode, insertVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameNode(oldEndVnode, newEndVnode)) {
      // 尾尾
      patchVnode(oldEndVnode, newEndVnode, insertVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameNode(oldStartVnode, newEndVnode)) {
      // 头尾
      patchVnode(oldStartVnode, newEndVnode, insertVnodeQueue)
      insertBefore(parentElm, oldStartVnode.elm, nextSibling(oldEndVnode.elm)!)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameNode(oldEndVnode, newStartVnode)) {
      // 尾头
      patchVnode(oldEndVnode, newStartVnode, insertVnodeQueue)
      insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 中间
      if (isUnDef(oldKeyToIdx)) {
        oldKeyToIdx = createKeyToIdxMap(oldCh, oldStartIdx, oldEndIdx)
      }

      idxInOld = oldKeyToIdx[newStartVnode.key]

      if (isUnDef(idxInOld)) {
        createElm(newStartVnode, insertVnodeQueue, parentElm, oldStartVnode.elm)
      } else {
        vnodeToMove = oldCh[idxInOld]
        if (sameNode(vnodeToMove, newStartVnode)) {
          // 相同节点，需要更新子节点和属性
          patchVnode(vnodeToMove, newStartVnode, insertVnodeQueue)
          oldCh[idxInOld] = undefined
          insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm) // 移动到旧头节点之前
        } else {
          // 不同节点，需要将新节点移到旧头节点之前
          createElm(newStartVnode, insertVnodeQueue, parentElm, vnodeToMove.elm)
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
  }

  if (oldStartIdx < oldEndIdx) {
    // 旧虚拟列表的子节点多于新虚拟列表的子节点个数，移除
    removeVNodes(oldCh, oldStartIdx, oldEndIdx)
  } else if (newStartIdx < newEndIdx) {
    // 新虚拟列表的子节点多于旧虚拟列表的子节点个数，新增
    /**
     * eg:
     * ref: null:
     *  1. abc
     *     abc(def)
     *
     * ref: newEndIdx + 1 元素之前
     *  1. abc
     *     (def)abc
     *  2. abc
     *     a(def)bc
     */
    refElm = isUnDef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVNodes(
      parentElm,
      refElm,
      newCh,
      newStartIdx,
      newEndIdx,
      insertVnodeQueue
    )
  }
}
/**
 * 修改更新的节点
 * @param preVnode
 * @param vnode
 */
function patchVnode(preVnode, vnode, insertVnodeQueue) {
  console.log(preVnode, vnode)
  if (preVnode === vnode) {
    console.log('vnode 没有变')
    return
  }
  const elm = (vnode.elm = preVnode.elm)
  const oldCh = preVnode.children
  const ch = vnode.children
  // 1. vnode.text 不存在
  if (isUnDef(vnode.text)) {
    // 1.1 preVnode.children 存在 vnode.children 存在
    if (isDef(oldCh) && isDef(ch)) {
      // 新旧虚拟节点对象不相同时
      if (oldCh !== ch) {
        console.log('patch children')
        patchChildren(elm, oldCh, ch, insertVnodeQueue)
      }
    } else if (isDef(ch)) {
      // 1.2 preVnode.children 不存在 vnode.children 存在
      // 如果旧虚拟节点是文字节点
      if (isDef(preVnode.text)) {
        setContent(elm, '')
      }
      console.log('新增节点')
      // 新增节点
      addVNodes(elm, null, ch, 0, ch.length - 1, insertVnodeQueue)
    } else if (isDef(oldCh)) {
      // 1.3 preVnode.children 存在 vnode.children 不存在
      // 移除节点
      console.log('移除节点')
      removeVNodes(oldCh, 0, oldCh.length - 1)
    } else if (isDef(preVnode.text)) {
      // 1.4 preVnode.children 不存在 vnode.children 不存在
      console.log('元素内容修改为空字符')
      setContent(elm, '')
    }
  } else if (preVnode.text !== vnode.text) {
    // 2 vnode.text 存在 且和 preVnode.text(不管有没有 children) 不相同时
    console.log('修改元素文本为新节点文本内容')
    setContent(elm, vnode.text)
  }
}

export function patch(preVnode, vnode) {
  const isRealEl = isDef(preVnode.nodeType)
  const insertVnodeQueue: any[] = []
  if (!isRealEl && sameNode(preVnode, vnode)) {
    // 是虚拟节点，则 diff
    patchVnode(preVnode, vnode, insertVnodeQueue)
  } else {
    if (isRealEl) {
      // 只有 preVnode 为真实元素时，才给它创建虚拟节点
      preVnode = new VNode(
        tagName(preVnode).toLowerCase(),
        {},
        [],
        undefined,
        preVnode
      )
    }
    // 是真实元素，则根据 vnode 创建元素
    const parentElm = parentNode(preVnode.elm)
    createElm(vnode, insertVnodeQueue, parentElm, nextSibling(preVnode.elm))
    // 移除原来的元素
    if (isDef(parentElm)) {
      removeChild(parentElm!, preVnode.elm)
    }
  }
  return vnode.elm
}
