const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://socketio:socket1o@ds223653.mlab.com:23653/chat-sockerio",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
