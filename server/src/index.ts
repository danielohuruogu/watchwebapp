const http = require('http')

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end('Hello World')


}).listen(8080)

console.log('Server running at http://127.0.0.1:8080/')
/* TO DO:
- add logic to load models from a db
  models will have to be processed and saved in a specific format, similar to how the loader currently works client-side
- 2 routes - get all model parts and get a specific model part

EXTRAS
- get a colour configuration for a model part
- get colour config for all model parts
- retrieve a colour configuration for a model part
- retrieve a colour configuration for all model parts

 in each route, will need to do the necessary processing to return the data in the organised format used by the client, the same pattern that's in hooks/loader.tsx
 */