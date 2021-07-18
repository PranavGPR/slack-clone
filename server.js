const express = require("express");
const app = express();
const socketServer = require("socket.io");

const PORT = 5000;

app.use(express.static(__dirname + "/public"));

app.use("/", (_req, res) => {
  res.send("Welcome to server!!");
});

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

  socket.on("newMessageToServer", (data) => {
    io.emit("messageToClients", { message: data.message });
  });
});
