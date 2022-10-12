import { codegen } from './codegen'
import { parseHTML } from './parser'

function createFunction(code: string) {
  return new Function(code)
}

export function compileToFunction(template: string) {
  const ast = parseHTML(template)
  const { render } = codegen(ast)

  return createFunction(render)
}
