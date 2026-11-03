/* demo state shared by the chapter interactions and the pinned bar, plus the screen-reader status line */
import { $ } from './util.js';
import { SITE } from './content.js';

export var demo = { unlocked: false, ver: 3, copied: false };
export var VLABEL = { 1: 'v1, ' + SITE.versions[1], 2: 'v2, ' + SITE.versions[2], 3: 'v3, ' + SITE.latest };
export var statusEl = $('#status');
