const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');

var reqsPerSecond = 0;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => res.send('If you do not know what this is you should not be here <3'))

app.get('/notifications/v1/:name', (req, res)=>{
  if (reqsPerSecond <= 9){
    axios.get('https://api.scratch.mit.edu/users/' + req.params.name + '/messages/count?'+ Date.now().toString())
    .then(response => res.json(response.data))
    reqsPerSecond++;
  } else {
    res.status(429).send('The server has gotten to many requests this second');
  }
});

setInterval(function(){
  reqsPerSecond = 0;
}, 1000);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))