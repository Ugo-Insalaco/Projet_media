const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')

app.use('/', express.static(path.join(__dirname, './srv/public')))

app.use('/private', express.static(path.join(__dirname, './srv/private')))
app.set('views',path.join(__dirname, './srv/private/views'))

app.get('/', function(req, res){
    res.render('media.ejs',{id:765})
})

app.get('/:id',function(req, res){
    const image = fs.readFileSync('./medias/oeuf.jpg')
    res.send(image)
})
console.log('lancement du serveur')
app.listen(3000)