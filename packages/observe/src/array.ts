import { def } from '@vue/shared'

export const arrayProto = Array.prototype

export const arrayMethods = Object.create(arrayProto)
const methods = ['push', 'pop', 'unshift', 'shift', 'sort', 'reverse', 'splice']
// 重写数组中的方法
methods.forEach((method) => {
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(...args: Array<any>) {
    // 调用原来的方法，叫做函数的劫持（AOP 切片编程）
    const result = original.apply(this, args)

    const ob = this.__ob__

    let inserted // 获取新增的值

    // 新增属性方法，获取值
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 新增的数据需要被观测，所以需要获取到 Observer 的方法
    // 需要为 this (arr) 添加一个 __ob__ 属性
    if (inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify() // 数组变化了通知对应的 watcher 更新
    return result
  })
})
