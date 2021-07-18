const express = require("express");
const app = express();
const socketServer = require("socket.io");

const PORT = 5000;

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});

const io = socketServer(expressServer);

io.on("connection", (socket) => {
  socket.emit("messageFromServer", {
    message: "Welcome to the Socket.io server!",
  });
  socket.on("messageToServer", (data) => {
    console.log(data);
  });
  socket.join("level1");
  socket
    .to("level1")
    .emit("joined", `${socket.id} says I have joined level1 room`);
});

io.of("/admin").on("connection", () => {
  console.log("Connected to admin namespace");
  io.of("/admin").emit("welcome", "Welcome to admin channel!");
});
