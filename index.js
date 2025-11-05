//NEW CODE WITH CORRECT ROUYTING ORDER
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const ExpressError = require("./ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// ⚠️ (Suggestion) move this middleware above routes for safety — moved up from below
// Previous order: after routes
// New order: before routes
app.use(express.urlencoded({ extended: "true" }));

main()
  .then((res) => {
    console.log("Connection succesfull");
  })
  .catch((err) => {
    console.log(err);
  });

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
// }

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

// ---------------- ROUTES ----------------

// Previous order: 1
// New order: 1 (same)
app.get("/", (req, res) => {
  res.send("Root is working");
});

// Previous order: 2
// New order: 2 (same)
app.get("/chats", async (req, res) => {
  try {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
  } catch (err) {
    next(err);
  }
});

// Previous order: 4
// New order: 3 (moved above /chats/:id)
// Reason: prevent "/chats/new" being read as "/chats/:id"
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

// Previous order: 5
// New order: 4 (keep after /chats/new)
app.post("/chats", async (req, res, next) => {
  try {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      msg: msg,
      createdAt: new Date(),
    });

    await newChat.save();
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

// Previous order: 3
// New order: 5 (moved below /chats/new)
// Reason: avoid "/chats/new" triggering this route
app.get("/chats/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      throw new ExpressError(404, "chat not found");
    }
    res.render("edit.ejs", { chat });
  } catch (err) {
    next(err);
  }
});

// Previous order: 6
// New order: 6 (same relative to show route)
app.get("/chats/:id/edit", async (req, res) => {
  try {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  } catch (err) {
    next(err);
  }
});

// Previous order: 8
// New order: 7 (same position after edit route)
app.post("/chats/:id/delete", async (req, res) => {
  try {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

// Previous order: 7
// New order: 8 (after delete route, keeps logical flow)
app.post("/chats/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedAt = new Date();
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { msg: newMsg, updatedAt: new Date() },
      { runValidators: true, new: true }
    );
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

// Previous order: 9
// New order: 9 (same, stays at end)
app.use((err, req, res, next) => {
  let { status = 500, message = "Some error Occured" } = err;
  res.status(status).send(message);
});

// Previous order: 10
// New order: 10 (same)
app.listen(8080, () => {
  console.log("Server is listening on port : 8080");
});

//OLD CODE WITH INCORRECT ROUYTING ORDER

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const Chat = require("./models/chat.js");
// const ExpressError = require("./ExpressError.js");

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// app.use(express.static(path.join(__dirname, "public")));

// // let chat1 = new Chat({
// //     from: "Viksit",
// //     to: "Akshay",
// //     msg: "Hello bro !!!",
// //     createdAt: new Date()
// // });

// // chat1.save().then((res) => {
// //     console.log(res);
// // }).catch((err) => {
// //     console.log(err);
// // });

// // Chat.findByIdAndDelete("68fa494380bc18c1fb562096").then((res) => {
// //     console.log("Succesfully deleted all");
// // }).catch((err) => {
// //     console.log(err);
// // });

// main()
//   .then((res) => {
//     console.log("Connection succesfull");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // async function main() {
// //   await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
// // }

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
// }

// app.get("/", (req, res) => {
//   res.send("Root is working");
// });

// app.get("/chats", async (req, res) => {
//   let chats = await Chat.find();
//   // console.log(chats);
//   // res.send("Working properly");
//   res.render("index.ejs", { chats });
// });
// //show route
// app.get("/chats/:id", async (req, res, next) => {
//   let { id } = req.params;
//   let chat = await Chat.findById(id);
//   if (!chat) {
//     next(new ExpressError(404, "chat not found"));
//   }
//   res.render("edit.ejs", { chat });
// });
// app.get("/chats/new", (req, res) => {
//   res.render("new.ejs");
// });
// app.post("/chats", (req, res) => {
//   let { from, to, msg } = req.body;
//   let newChat = new Chat({
//     from: from,
//     to: to,
//     msg: msg,
//     createdAt: new Date(),
//   });

//   newChat
//     .save()
//     .then((res) => {
//       console.log("saved");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   res.redirect("/chats");
// });

// app.use(express.urlencoded({ extended: "true" }));

// app.get("/chats/:id/edit", async (req, res) => {
//   let { id } = req.params;
//   let chat = await Chat.findById(id);
//   // console.log(chat);
//   res.render("edit.ejs", { chat });
// });

// app.post("/chats/:id/delete", async (req, res) => {
//   let { id } = req.params;
//   let deletedChat = await Chat.findByIdAndDelete(id);
//   console.log(deletedChat);
//   res.redirect("/chats");
// });

// app.post("/chats/:id", async (req, res) => {
//   let { id } = req.params;
//   let { msg: newMsg } = req.body;
//   let updatedAt = new Date();
//   let updatedChat = await Chat.findByIdAndUpdate(
//     id,
//     { msg: newMsg, updatedAt: new Date() },
//     { runValidators: true, new: true }
//   );
//   res.redirect("/chats");
// });

// app.use((err, req, res, next) => {
//   let { status = 500, message = "Some error Occured" } = err;
//   res.status(status).send(message);
// });

// app.listen(8080, () => {
//   console.log("Server is listening on port : 8080");
// });
