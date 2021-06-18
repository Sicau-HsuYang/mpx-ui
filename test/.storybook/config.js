/* eslint-disable import/no-extraneous-dependencies */
import { configure, addParameters } from '@storybook/vue'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import Vue from 'vue';

addParameters({
  options: {
    brandTitle: 'xpub 组件单测',
    brandUrl: 'https://git.xiaojukeji.com/webx/webx-ui',
    addonPanelInRight: true,
  },
  viewport: {
    defaultViewport: 'iphone6',
  },
});

const req = require.context('../stories', true, /.story.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}
configure(loadStories, module)
