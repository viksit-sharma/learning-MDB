const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
  .then((res) => {
    console.log("Connection succesfull");
  })
  .catch((err) => {
    console.log(err);
  });

// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
// }

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}
let chats = [
  {
    from: "Viksit",
    to: "Akshay",
    msg: "Hello bro !!!",
    createdAt: new Date(),
  },
  {
    from: "Akshay",
    to: "Viksit",
    msg: "Hii bro !!!",
    createdAt: new Date(),
  },
  {
    from: "Viksit",
    to: "Akshay",
    msg: "Kya kar rahe ho",
    createdAt: new Date(),
  },
  {
    from: "Akshay",
    to: "Viksit",
    msg: "kuch nhi bas RDR2 khel raha tha",
    createdAt: new Date(),
  },
  {
    from: "Viksit",
    to: "Akshay",
    msg: "Main bhi GTA5 hi khel raha tha",
    createdAt: new Date(),
  },
];
Chat.insertMany(chats);

// let chat1 = new Chat({
//     from: "Viksit",
//     to: "Akshay",
//     msg: "Hello bro !!!",
//     createdAt: new Date()
// });

// chat1.save().then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// });
