import BaseModel from '@didi/webx-ui-utils/src/model.js'
import { propsForModel as properties } from './props'

const TYPE = 'test'
const NAME = '测试'

class Model extends BaseModel {
  constructor () {
    super(TYPE, NAME)
    this.props = properties
  }
}

export default Model
