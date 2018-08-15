const Koa = require("koa")
const app = new Koa()
var server = require('http').createServer(app.callback())
var io = require('socket.io')(server)
const path = require("path")
const fs = require("fs")

// WARNING: app.listen(80) will NOT work here!
const template = fs.readFileSync(path.resolve(__dirname, './index.html'))
app.use(async (ctx) => {
    ctx.type = 'html'
    ctx.body = template
})

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('chat message', function (data) {
    console.log(data);
  });
});

server.listen(8000)