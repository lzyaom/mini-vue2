export type ASTAttr = {
  name: string
  value: any
}

export type ASTElement = {
  type: 1
  tag: string
  attrs: Array<ASTAttr>
  // attrsMap: { [key: string]: any };
  // rawAttrsMap: { [key: string]: ASTAttr };
  parent: ASTElement | void
  children: Array<ASTNode>
}

export type ASTNode = ASTElement | ASTText

export type ASTText = {
  type: 3
  text: string
  parent: ASTElement
  static?: boolean
  isComment?: boolean
}

export function createASTElement(
  tag: string,
  attrs: Array<ASTAttr>,
  parent: ASTElement | void
): ASTElement {
  return {
    tag,
    type: 1,
    attrs,
    parent,
    children: [],
  }
}

export function createASTText(text: string, parent: ASTElement): ASTText {
  return {
    type: 3,
    text,
    parent,
  }
}
