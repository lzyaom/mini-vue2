export { nextTick } from './nextTick'
export { invokeErrorWithHandling } from './handleError'

/**
 * 定义属性
 * @param target 目标对象
 * @param key 属性名
 * @param value 值
 * @param enumerable 是否可遍历
 */
export function def(
  target: Object,
  key: string,
  value: any,
  enumerable?: boolean
) {
  Object.defineProperty(target, key, {
    value: value,
    configurable: true,
    writable: true,
    enumerable: !!enumerable,
  })
}

/**
 *
 * @param val
 * @returns
 */
export function isObject(val) {
  return val && typeof val === 'object'
}

/**
 *
 * @param val
 * @returns
 */
export function isPlainObject(val) {
  return Object.prototype.toString.call(val) === '[object object]'
}

/**
 *
 * @param obj
 * @param key
 * @returns
 */
export function hasOwn(obj: Object | Array<any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 *
 * @param el
 * @returns
 */
export function query(el: string | Element): Element {
  if (typeof el === 'string') {
    return document.querySelector(el)!
  } else {
    return el
  }
}

/**
 *
 * @param val
 * @returns
 */
export function toString(val: any) {
  return JSON.stringify(val)
}