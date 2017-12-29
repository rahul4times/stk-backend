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

io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => topGainer(socket),
    500
  );
  socket.on("disconnect", () => console.log("Client disconnected"));
});




const oneCompanyOnly = async socket => {
  try {
    const res = await axios.get(
      "https://api.iextrading.com/1.0/stock/ssc/quote"
    );
    socket.emit("FromAPI", res.data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

const topGainer = async socket => {
  try {
    const res = await axios.get(
      "https://api.iextrading.com/1.0/stock/market/list/gainers"
    );
    
    socket.emit("topGainerList", res.data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};
server.listen(port, () => console.log(`Listening on port ${port}`));
