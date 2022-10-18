declare interface VNodeData {
  key?: string | number
  slot?: string
  ref?: string
  is?: string
  tag?: string
  class?: any
  style?: string | Array<Object> | Object
  prop?: { [key: string]: any }
  attrs?: { [key: string]: string }
}
