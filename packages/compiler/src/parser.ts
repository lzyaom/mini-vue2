import { ASTElement, createASTElement, createASTText } from './ast'

// 标签名
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
//
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 匹配到的分组是一个标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
// 匹配的是 </xxx>，最终匹配到的是结束标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 属性，value 可能是分组3/4/5
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
export function parseHTML(html: string): ASTElement {
  const stack: ASTElement[] = []
  let currentParent: ASTElement, root
  while (html) {
    //
    let textEnd = html.indexOf('<')
    // 表示 开始/结束 标签
    // > 0 表示文本的结束位置
    if (textEnd === 0) {
      // 解析到开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 匹配到结束标签
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    if (textEnd > 0) {
      // 解析到文本
      let text = html.substring(0, textEnd)
      if (text) {
        advance(text.length)
        chars(text)
      }
    }
  }
  // 步进，截取字符
  function advance(n: number) {
    html = html.substring(n)
  }
  // 解析开始标签和属性
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match: any = {
        tagName: start[1],
        attrs: [],
      }
      advance(start[0].length)
      let attr, end
      // 不是开始标签的结束(>)，就一直匹配下去

      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true,
        })
      }
      // 处理 >
      if (end) {
        advance(end[0].length)
        return match
      }
    }

    return false
  }
  // 处理开始标签，生成对应的 ast
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs)
    if (!root) {
      root = node
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node
  }
  // 处理文本内容，生成 文本 ast
  function chars(text: string) {
    text = text.replace(/\s/g, '')
    if (text) {
      currentParent.children.push(createASTText(text, currentParent))
    }
  }
  // 处理结束标签
  function end(tag: string) {
    stack.pop()
    currentParent = stack[stack.length - 1]
  }
  return root
}
