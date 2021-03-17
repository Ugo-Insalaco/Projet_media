const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')

app.use('/', express.static(path.join(__dirname, './srv/public')))

app.use('/private', express.static(path.join(__dirname, './srv/private')))
app.set('views',path.join(__dirname, './srv/private/views'))

app.get('/', function(req, res){
    res.render('media.ejs', { id: 765 })
})

app.get('/video', function(req, res){
    const filenames = fs.readdirSync(path.join(__dirname,'/srv/public/video'))
    res.send(filenames)
})

const recupfichier = function(chemin){
    // récupération nom fichiers
    const filenames= fs.readdirSync(path.join(__dirname,`/srv/public/${chemin}`))

    // Pour chaque fichier
    if(filenames.length>0){
        for (let i=0; i<filenames.length; i++)
        // SI c'est un dossier
        if (filenames[i].split('.').length===1){

            app.get(`${chemin}/${filenames[i]}`, function(req, res){
                const filenames2 = fs.readdirSync(path.join(__dirname,`/srv/public/${chemin}/${filenames[i]}`))
                res.send(filenames2)
            })
            recupfichier(`${chemin}/${filenames[i]}`)
        }
        return 
    }
    else{
        return 
    }
}

recupfichier('/video')


console.log('lancement du serveur')
app.listen(3000)