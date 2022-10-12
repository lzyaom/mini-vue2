import {Watcher} from "./watcher"

// 一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知

let id = 0
/**
 * 被观察者（目标对象）
 */
export class Dep {
  static target?: Watcher | null
  id: number// 被观察者唯一标识
  subs: Array<Watcher>// 当前属性对应的 watcher 有哪些。 观察者列表，一个 dep 对应多个 watcher（一个属性对应多个 watcher）

  constructor () {
    this.id = id++
    this.subs = []
  }
  /**
   * 添加观察者
   * @param sub 
   */
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  /**
   * 当前 watcher 记住 dep(属性)
   */
  depend () {
    // 不能有重复的 watcher，
    // this.subs.push(Dep.target!)
    Dep.target?.addDep(this)
  }
  /**
   * 移除观察者
   * @param sub 
   */
  removeSub (sub: Watcher) {
    const idx = this.subs.indexOf(sub)
    this.subs.splice(idx, 1)
  }
  /**
   * 通知观察者更新
   */
  notify () {
    let i, len = this.subs.length
    for (i = 0; i < len; i++) {
      this.subs[i].update()
    }
  }
}

Dep.target = null

const targetStack: Array<Watcher | null | undefined> = []

export function pushTarget (target?: Watcher | null) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget(){
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}