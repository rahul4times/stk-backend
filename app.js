const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4000;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);



io.on("connection", socket => {

  console.log("New client connected"), setInterval(
    () => oneCompanyOnly(socket),
    500
  );

  socket.on("disconnect", () => console.log("Client disconnected"));
});


const oneCompanyOnly = async socket => {
  try {

    const res = await axios.get(
      "https://api.iextrading.com/1.0/stock/aapl/quote"
    );

    socket.emit("FromAPI", res.data);

    const res2 = await axios.get(
      "https://api.iextrading.com/1.0/stock/ssc/quote"
    );

    socket.emit("SSCApi", res2.data);

  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};


server.listen(port, () => console.log(`Listening on port ${port}`));
