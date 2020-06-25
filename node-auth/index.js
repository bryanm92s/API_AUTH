const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const passport = require("passport");

//Bring in the app constains
const { DB, PORT } = require("./config");

// Initialize the application
const app = exp();

//Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

//User Router Middleware
app.use("/api/users", require("./routes/users"));

const startApp = async () => {
  try {
    //Connection with DB
    await connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    success({
      message: `Successfully connected with the DataBase\n${DB}`,
      badge: true,
    });

    //Start Listenning for the server on PORT
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connected with the DataBase\n${err}`,
      badge: true,
    });
    startApp();
  }
};

startApp();
