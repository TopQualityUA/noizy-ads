'use strict';
import log from '../log.js';

let forbiddenPage = localStorage.getItem('lastForbiddenPage') || '';
log('Forbidden: ', forbiddenPage);

document.body.innerHTML = document.body.innerHTML.replace('{{blockedUrl}}', forbiddenPage);
