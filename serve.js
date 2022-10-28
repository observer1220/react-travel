// 後端伺服器
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
var Router = require('router')
const { default: axios } = require('axios')
var router = Router()
const port = 5000

const index = router.get('/', async (req, res) => {
    axios.get('https://newsapi.org/v2/top-headlines?country=tw&apiKey=abf3b20ed73441569a5f75878dfd1eda').then(res =>{
        console.log(res);
        res.send(res)
    })
});

app.use('/results', index)

app.listen(port, () => console.log(`Listening on port ${port}`))