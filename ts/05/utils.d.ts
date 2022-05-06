declare module '*.png'

declare module 'json!*' {
  let value: object
  export default value
}

declare module '*.css' {
  let css: CSSRuleList
  export default css
}