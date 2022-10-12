import { eventMixin, initMixin, lifecycleMixin, stateMixin, renderMixin} from "@vue/core"

// 使用构造函数是为了扩展方式，将不同的方法放到不同的位置
function Vue(options) {
  // 初始化
  this._init(options)
}
//@ts-expect-error
initMixin(Vue)
//@ts-expect-error
lifecycleMixin(Vue)
//@ts-expect-error
eventMixin(Vue)
//@ts-expect-error
stateMixin(Vue)
//@ts-expect-error
renderMixin(Vue)

export default (Vue as unknown) as GlobalAPI
