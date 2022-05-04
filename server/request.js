const http = require("http");
http.createServer((req, res) => {
    if (req.url == "/addRouter") {
      console.log(234567);
    }
    res.end("1323");
}).listen(2326);
