const uuidv1 = require("uuid/v1");
const rooms = [
  {
    id: uuidv1(),
    title: "결제",
    users: [],
    messages: []
  },
  {
    id: uuidv1(),
    title: "청구서",
    users: [],
    messages: []
  },
  {
    id: uuidv1(),
    title: "멤버십",
    users: [],
    messages: []
  },
  {
    id: uuidv1(),
    title: "송금",
    users: [],
    messages: []
  }
];

module.exports = rooms;
