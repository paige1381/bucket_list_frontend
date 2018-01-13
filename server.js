const express = require('express');
const app     = express();
const PORT    = 3001;

app.use(express.static('public'));

app.get('*', function(req, res) {
  res.sendfile('./public/index.html')
})

app.listen(PORT, () => console.log('Bucket List running on PORT:' + PORT) );
