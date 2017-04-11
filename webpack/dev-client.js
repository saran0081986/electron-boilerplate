/**
 * @file Script sent to the browser.
 */

const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

// Reloads on HTML file change, see dev.js.
hotClient.subscribe(event => {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
