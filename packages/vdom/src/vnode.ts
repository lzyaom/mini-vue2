import type { Component } from '#type/component'
// import type { VNodeData } from '#type/vnode'

export class VNode {
  tag?: string
  data: VNodeData | undefined
  children?: Array<VNode> | null
  text?: string
  elm: Node | undefined
  key: string | number | undefined
  context?: Component

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode> | null,
    text?: string,
    elm?: Node,
    context?: Component
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.context = context
  }
}
/**
 * 创建元素节点
 * @param tag
 * @param data
 * @param children
 * @param context
 * @returns
 */
export function createElementVNode(
  tag: string,
  data: any,
  children: any,
  context: Component
) {
  return new VNode(tag, data, children, undefined, undefined, context)
}

/**
 * 创建文本节点
 * @param val
 * @returns
 */
export function createTextVNode(val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}
