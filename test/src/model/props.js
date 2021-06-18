import transformProps from '@didi/webx-ui-utils/src/transform-props'

const props = {
  img: {
    type: String,
    value: '//dpubstatic.udache.com/static/dpubimg/090757ef-3042-4acc-b5c8-f457763944a5.jpg'
  },
  buttonText: {
    type: String,
    value: '默认按钮文案'
  }
}

let {
  propsForModel
} = transformProps(props)

export {
  props,
  propsForModel
}
