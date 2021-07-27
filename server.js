require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const dns = require('dns')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

var URLarray = []
var index = 0

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {

  const { url: URL } = req.body

  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

  var regex = new RegExp(expression)

  if (URL.match(regex)) {
    URLarray.push({ original_url: URL, short_url: index })
    index++

    console.log(URLarray)

    return res.json(URLarray[index-1])
  } else {
    return res.json({ error: 'invalid url' })
  }
})

app.get('/api/shorturl/:url_code', (req, res) => {
  res.redirect(URLarray[req.params.url_code].original_url)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
