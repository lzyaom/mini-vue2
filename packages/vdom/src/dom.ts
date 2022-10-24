import { VNode } from './vnode'

/**
 * 创建元素
 * @param tag 标签名
 * @param vnode VNode
 * @returns ELement
 */
export function createElement(tag: string, vnode: VNode): Element {
  const el = document.createElement(tag)

  return el
}

/**
 * 创建文本节点
 * @param text
 * @returns Text
 */
export function createText(text: string): Text {
  return document.createTextNode(text)
}
/**
 * 添加子节点
 * @param el 父节点
 * @param child 子节点
 */
export function appendChild(el: Node, child: Node) {
  el.appendChild(child)
}
/**
 * 插入到参考节点之前
 * @param parentNode 父节点
 * @param newNode 新元素节点
 * @param refNode 参考节点
 */
export function insertBefore(parentNode: Node, newNode: Node, refNode: Node) {
  parentNode.insertBefore(newNode, refNode)
}

/**
 * 移除子节点
 * @param node 父节点
 * @param child 子节点
 */
export function removeChild(node: Node, child: Node) {
  node.removeChild(child)
}

/**
 * 获取下一个相邻节点
 * @param node
 * @returns
 */
export function nextSibling(node: Node) {
  return node.nextSibling
}

/**
 * 获取父节点
 * @param node
 * @returns
 */
export function parentNode(node: Node) {
  return node.parentNode
}

/**
 * 获取节点名称
 * @param node
 * @returns
 */
export function tagName(node: Element): string {
  return node.tagName
}

/**
 * 设置属性
 * @param el
 * @param key
 * @param value
 */
export function setAttribute(el: Element, key: string, value: string) {
  el.setAttribute(key, value)
}

export function setContent(el: Element, text: string) {
  el.textContent = text
}
