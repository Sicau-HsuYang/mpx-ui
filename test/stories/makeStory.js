import Vue from 'vue'
// import VueI18n from 'vue-i18n'
import { storiesOf } from '@storybook/vue'
import transformProps from '@didi/webx-ui-utils/src/transform-props'

import * as AddonKnobs from '@storybook/addon-knobs'

const { withKnobs } = AddonKnobs

const cpRegistry = (cpList = []) => {
  cpList.forEach((cp) => {
    const { name = 'cp', component } = cp
    Vue.component(name, component) // 注册vue组件
  })
}

// Vue.use(VueI18n)

export function makeStory (cpList, {
  menu = '默认'
}) {
  cpRegistry(cpList)

  const story = storiesOf(menu, module)
    .addDecorator(withKnobs)
    .addParameters({ viewport: { defaultViewport: 'iphone6' } })

    // eslint-disable-next-line
  story.addStory = function addKnobs({
    unitName, props, cpName, parentCp
  }) {
    const knobs = transformProps(props).propsForStory || {}
    let knobsAttrs = ''
    const knobsArray = Object.entries(knobs)
    knobsArray.forEach(([key]) => {
      knobsAttrs += `:${key}="${key}" `
    })
    const knobsTemplate = '<' + (cpName || cpList[0].name) + ' ' + knobsAttrs + '  />'

    return this.add(unitName, () => {
      const knobsProps = {}
      console.log('knobsArray:', knobsArray)
      knobsArray.forEach(([key, val]) => {
        const [type = 'text', ...opt] = val
        knobsProps[key] = {
          default: AddonKnobs[type](key, ...opt)
        }
      })
      const storyUnit = {
        props: knobsProps,
        template: knobsTemplate
      }
      return Object.assign({}, storyUnit, parentCp)
    })
  }

  return story
}
