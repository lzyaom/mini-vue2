import { Component } from './component'

declare interface GlobalAPI {
  (options?: any): void
  cid: number
  options: Record<string, any>
  extend: (options: typeof Component | object) => typeof Component
  use: (plugin: Function | Object) => GlobalAPI
  mixin: (mixin: Object) => GlobalAPI
  directive: (id: string, def?: Function | Object) => Function | Object | null
  component: (
    id: string,
    def?: typeof Component | Object
  ) => typeof Component | void
  filter: (id: string, def?: Function) => Function | void
  [key: string]: any
}
