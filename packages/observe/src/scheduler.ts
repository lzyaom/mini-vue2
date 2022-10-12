import { nextTick } from '@vue/shared'
import { Watcher } from './watcher'

let queue: Array<Watcher> = []
let has: { [key: number]: true | undefined } = {}
let waiting = false

// 批处理更新任务
function flushSchedulerQueue() {
  const flushQueue = queue.slice(0)
  waiting = false
  has = {}
  queue = []
  flushQueue.forEach((watcher) => watcher.run())
}

export function queueWatcher(watcher: Watcher) {
  const id = watcher.id
  if (!has[id]) {
    // 去重，对于同一个 watcher 多次触发只会有一次生效
    has[id] = true
    queue.push(watcher)

    if (!waiting) {
      nextTick(flushSchedulerQueue)
      waiting = true
    }
  }
}
