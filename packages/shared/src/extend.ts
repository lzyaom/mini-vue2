export type PropertyKey = string | number | symbol
/**
 * 将 源(from) 对象中的 key-value 复制到目标对象(to)
 * @param to 目标对象
 * @param from 源对象
 * @returns 目标对象
 */
export function extend(
  to: Record<PropertyKey, any>,
  from: Record<PropertyKey, any>
) {
  for (const key in from) {
    to[key] = from[key]
  }
  return to
}
