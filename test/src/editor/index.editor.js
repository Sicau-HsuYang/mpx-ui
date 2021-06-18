import mpx from '@mpxjs/core'
import apiProxy from '@mpxjs/api-proxy'
import fetch from '@didi/mpx-fetch'

import Main from './index?component'

import Model from '../model'

import FormConf from '../model/form'

mpx.use(apiProxy, { usePromise: true }).use(fetch)

Main.install = (Vue) => {
  Vue.component(Main.name, Main)
}

Main.model = Model
Main.formConf = FormConf

export default Main

export const components = {
}
