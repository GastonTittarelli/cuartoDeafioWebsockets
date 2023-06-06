import express from "express";
import productRouter from "./src/routes/products.js";
import cartRouter from "./src/routes/cart.js";
import handlebars from "express-handlebars";
import ProductManager from "./src/datos/ManagerProducts.js";

import http from "http";
import socketIO from "socket.io";
// import { Server } from "socket.io";

const manager = new ProductManager();

const app = express();
const serve = http.createServer(app);
const io = socketIO(serve);

app.engine("handlebars", handlebars.engine());
app.set("views", "./views");
app.set("view engine", "handlebars")



app.get("/hbs", async (req, res) => {
    let productos = await manager.getProducts();

    res.render("productos", {productos});
})


io.on("connection", (socket) => {
    console.log("Un cliente se ha conectado");

    socket.emit("productos", manager.getProducts());
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

const PORT = 8080;
const server = app.listen(PORT, () => console.log(`Servidor corriendo en puerto: ${server.address().port}`))
server.on("error", error => console.log(error))

