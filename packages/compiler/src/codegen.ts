import { ASTAttr, ASTElement, ASTNode, ASTText } from './ast'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

/**
 * _c 创建元素
 * _v 创建文本
 * _s 变为字符串
 */

/**
 * 生成 render 代码
 * @param ast
 * @returns
 */
export function codegen(ast: ASTElement) {
  const code = genElement(ast)
  return {
    render: `with(this){return ${code}}`,
  }
}

/**
 * 生成渲染元素
 * @param el
 * @returns
 */
function genElement(el: ASTElement): string {
  const data = genData(el)
  const children = genChildren(el.children)
  return `_c('${el.tag}'${data ? `,${data}` : ''}${
    children ? `,${children}` : ''
  })`
}

/**
 *
 * @param el
 * @returns
 */
function genData(el: ASTElement): string {
  let data = '{'
  if (el.attrs) {
    data += `attrs:${genProp(el.attrs)},` // attrs:{...}
  }
  data = data.replace(/,$/, '') + '}'
  return data
}

/**
 * 生成属性
 * @param attrs
 * @returns
 */
function genProp(attrs: Array<ASTAttr>): string {
  let props = ``
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (attr.name === 'style') {
      const listDelimiter = /;(?![^(]*\))/g
      const propertyDelimiter = /:(.+)/
      attr.value = attr.value.split(listDelimiter).reduce((prev, item) => {
        if (item) {
          const [key, value] = item.split(propertyDelimiter)
          prev[key] = value.trim()
        }
        return prev
      }, {})
    }
    props += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  props = `{${props.slice(0, -1)}}`
  return props
}

/**
 * 生成子节点
 * @param children
 */
function genChildren(children: Array<ASTNode>): string {
  return `[${children.map((child) => gen(child)).join(',')}]`
}

/**
 *
 * @param node
 * @returns
 */
function gen(node: ASTNode) {
  if (node.type === 1) {
    return genElement(node)
  } else if (node.type === 3) {
    return genText(node)
  }
}
/**
 * 生成文本
 * @param node
 */
function genText(node: ASTText) {
  let text = node.text
  if (!defaultTagRE.test(text)) {
    // 静态文本
    return `_v(${JSON.stringify(text)})`
  } else {
    // 有动态文本
    const tokens: string[] = []
    let lastIndex = (defaultTagRE.lastIndex = 0)
    let match, index
    while ((match = defaultTagRE.exec(text))) {
      index = match.index // 匹配的位置
      // 动态文本之间有纯文本时
      if (index > lastIndex) {
        // 添加纯文本内容
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }

      tokens.push(`_s(${match[1].trim()})`)
      // 更新，指向下一个{{}}的开始位置
      lastIndex = index + match[0].length
    }
    // 动态文本之后还有纯文本，截取
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`
  }
}
