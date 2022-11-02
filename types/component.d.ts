import { GlobalAPI } from './global-api'

export declare class Component {
  constructor(options?: any)

  static cid: number
  static options: Record<string, any>
  static super: typeof Component
  static extend: GlobalAPI['extend']
  static mixin: GlobalAPI['mixin']
  static use: GlobalAPI['use']
  static directive: GlobalAPI['directive']
  static component: GlobalAPI['component']
  static filter: GlobalAPI['filter']
  // 公共属性
  $el: any //
  $data: Record<string, any> //
  $props: Record<string, any>
  $options: Record<string, any> // 选项

  // 公共方法
  $mount: (el?: Element | string) => Component // 将模版解析为 虚拟 DOM，然后渲染为真实 DOM
  $forceUpdate: () => void // 强制更新
  $destory: () => void // 销毁模版，移除所有的实例指示的东西，事件监听器、子实例等等
  $set: <T>(
    target: Record<string, any> | Array<T>,
    key: string | number,
    value: T
  ) => T // 手动设置对象或数组添加新属性为响应式
  $delete: <T>(
    target: Record<string, any> | Array<T>,
    key: string | number
  ) => void // 删除对象或数组中的属性时，响应式更新对象或数组
  $watch: (
    expOrFn: string | Function,
    handler: Function,
    options?: Object
  ) => Function
  $on: (event: string, fn: Function) => Component
  $once: (event: string, fn: Function) => Component
  $off: (event: string, fn: Function) => Component
  $emit: (event: string, ...args: Array<any>) => Component
  $nextTick: (fn: Function) => void | Promise<any>
  $createElement: (
    tag: string | Component,
    data?: Record<string, any>,
    children?: []
  ) => void

  // 生命周期
  _init: Function
  _mount: (el: Element | Component) => Component
  _update: (vnode: object) => void;

  [key: string]: any
}
