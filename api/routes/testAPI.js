var express = require("express");
var router = express.Router();

const data = { a: 1, b: 2, c: 3, d: 4 };

router.get("/", function(req, res) {
    res.send(data);
});

module.exports = router;