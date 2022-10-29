export function initUse(Vue) {
  Vue.use = function (plugin: Function | any, ...args: any[]) {
    // 获取安装的插件
    const instlledPlugins =
      this._installedPlugins || (this._installedPlugins = [])
    // 已安装则直接返回
    if (instlledPlugins.indexOf(plugin) > -1) {
      return this
    }
    // 插件的第一个参数为应用实例
    args.unshift(this)
    // 判断是有 install 方法的对象，还是函数
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    instlledPlugins.push(plugin)
    return this
  }
}
