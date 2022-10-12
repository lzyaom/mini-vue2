import { isPromise } from 'util/types'

export function invokeErrorWithHandling(
  handle: Function,
  context: any,
  args: null | any[],
  vm: any,
  info: string
) {
  let res
  try {
    res = args ? handle.apply(context, args) : handle.call(context)
    if (res && isPromise(res)) {
      res.catch((e) => console.error(e))
    }
  } catch (error) {
    console.error(error)
  }
  return res
}

export function handleError() {}
