const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path")

const Chat = require("./models/Chat");

require("./config/db");

const app = express();
var server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')))

let io = socketio(server);

io.on("connection", socket => {
  sendStatus = s => {
    socket.emit("status", s);
  };

  Chat.find()
    .limit(100)
    .sort({ _id: 1 })
    .then(chats => {
      socket.emit("output", chats);
    })
    .catch(err => console.log(err));

  socket.on("input", data => {
    let newData = {
      name: data.name,
      message: data.message
    };

    if (newData.name === "" || newData.message === "") {
      sendStatus("Please enter a name and message");
    } else {
      Chat.create(newData).then(chat => {
        io.emit("output", [data]);

        sendStatus({
          message: "Message Sent",
          clear: true
        });
      });
    }
  });

  socket.on("clear", data => {
    Chat.deleteMany({}).then(() => {
      socket.emit("cleared");
    });
  });
});

server.listen(4000, () => console.log("Socket IO listening in port 4000"));
app.listen(3000, () => console.log("App listening in port 3000"));
