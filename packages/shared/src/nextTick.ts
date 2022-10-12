// 异步更新，批处理

let callbacks: Array<Function> = []
let pending = false

// 批处理更新任务
function flushCallbacks() {
  const flushQueue = callbacks.slice(0)
  callbacks = []
  pending = false
  flushQueue.forEach((cb) => cb())
}

let timeFunc

if (typeof Promise !== 'undefined') {
  timeFunc = () => Promise.resolve().then(flushCallbacks)
} else if (typeof MutationObserver !== 'undefined') {
  let counter = 1
  const text = document.createTextNode(String(counter))
  const observer = new MutationObserver(flushCallbacks)

  observer.observe(text, {
    characterData: true,
  })

  timeFunc = () => {
    text.data = String(counter++ & 1)
  }
} else if (typeof setImmediate !== 'undefined') {
  // ie
  timeFunc = () => setImmediate(flushCallbacks)
} else {
  timeFunc = () => setTimeout(flushCallbacks, 0)
}

export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (error) {
        console.error(error)
      }
    } else if (_resolve) {
      _resolve(ctx) // 当所有回调执行完后，返回的 Promise 的 state 才改变为 fulfilled
    }
  })

  if (!pending) {
    // 当一批任务处理完或者暂未开始处理时，执行回调
    timeFunc()
    pending = true
  }
  if (!cb && typeof Promise !== 'undefined') {
    // 只有没传回调，且 Promise 可用时才返回 Promise 对象
    return new Promise((resolve) => {
      _resolve = resolve
    })
  }
}
