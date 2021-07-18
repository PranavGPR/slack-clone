const express = require("express");
const app = express();
const socketServer = require("socket.io");

let namespaces = require("./data/namespaces");

const PORT = 5000;

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});

const io = socketServer(expressServer);

io.on("connection", (socket) => {
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  socket.emit("nsList", nsData);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {});
});
