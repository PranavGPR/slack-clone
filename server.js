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
  io.of(namespace.endpoint).on("connection", (socket) => {
    console.log(`${socket.id} has joined ${namespace.endpoint}`);

    socket.emit("wikiRoomLoad", namespaces[0].rooms);

    socket.on("joinRoom", async (roomToJoin) => {
      // const roomToLeave = Array.from(socket.rooms)[1];
      // socket.leave(roomToLeave);
      // await updateUsersInRoom(namespace, roomToLeave);

      socket.join(roomToJoin);
      await updateUsersInRoom(namespace, roomToJoin);

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });

      socket.emit("historyCatchUp", nsRoom.history);
    });

    socket.on("newMessageToServer", (data) => {
      const fullMessage = {
        text: data.text,
        time: Date.now(),
        username: "rbunch",
        avatar: "https://via.placeholder.com/30",
      };

      const roomTitle = Array.from(socket.rooms)[1];

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });

      nsRoom.addMessage(fullMessage);

      io.of("/wiki").to(roomTitle).emit("messageToClients", fullMessage);
    });
  });
});

async function updateUsersInRoom(namespace, roomToJoin) {
  const clients = await io.of(namespace.endpoint).in(roomToJoin).allSockets();
  io.of(namespace.endpoint).in(roomToJoin).emit("updateMembers", clients.size);
}
