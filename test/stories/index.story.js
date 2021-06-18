/* eslint-disable func-names */
import view from '../src/editor/index.editor'
import { props } from '../src/model/props'
import { makeStory } from './makeStory'

const story = makeStory([
  {
    name: 'test',
    component: view
  }
], {
  menu: '测试'
})

story.addStory({
  unitName: '主页',
  cpName: 'test',
  props
})
