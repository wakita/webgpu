import '/style.css'
import javascriptLogo from '/javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import * as test_2023_06_06 from './2023-06-06-dispatch-bug/dispatch.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
      <button id="b2023-06-06" type="button">2023-06-06 Dispatch Bug Test</button>
      <div id="card_log" class="log"><p></p></div>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
    <canvas width="800" height="600"></canvas>
  </div>
`

setupCounter(document.querySelector('#counter'))
test_2023_06_06.initialize(document.querySelector('#b2023-06-06'), document.querySelector('#card_log'))
