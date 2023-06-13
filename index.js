const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Get all the school Major!");
});
app.get('/api/majors', (req, res) => {
    res.send([
        'Name: E-Commerce',
        'Name: Computer Science',
        'Name: Telecom and Networking'
    ])
})
app.listen(3003, () => console.log("Listening on Port 3003..."));
