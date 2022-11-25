const express = require("express")
const mongoose = require('mongoose');
const session = require("express-session")
const redis = require("redis")
const cors = require('cors')
let RedisStore = require("connect-redis")(session)

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, SESSION_SECRET, REDIS_PORT } = require("./config/config");

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

const app = express()

mongoose.connect(
    `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
    ).then(() => console.log("Successfully connected to DB")).catch((e) => console.log(e))

app.enable("trust proxy")  
app.use(cors({}))  

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 60000,
        },
    })
)

app.use(express.json())

app.get("/api/v1", (req, res) => {
    res.send("<h2>Hi there!!! My name is Phil. Are you working? Yes I am. Allez les bleus!!!!!! Giroud is the man!!!!!</h2>");
      console.log("yeah it ran");
});


//localhost:3000/api/v1/post/
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}`))
