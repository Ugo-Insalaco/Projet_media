// Importation des packages
const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const jsonParser = require('body-parser').json({
    type: "application/vnd.api+json",
})
const xss = require('xss')


// Requêtes des fichiers statiques
app.use('/', express.static(path.join(__dirname, './srv/public')))
app.use('/private', express.static(path.join(__dirname, './srv/private')))

// Initialisation du dossier des views
app.set('views',path.join(__dirname, './srv/private/views'))

// Requête princpale (affichage de la page)
app.get('/', function(req, res){
    res.render('media.ejs', { id: 765 })
})

// Revoie les nom des dossiers du dossier principal 'video'
app.get('/video', function(req, res){
    const filenames = fs.readdirSync(path.join(__dirname,'/srv/public/video'))
    res.send(filenames)
})

app.get('/videoPlaylist', function(req,res){
    //renvoyer la liste des noms des playlistes
    res.send(Object.keys(playlistobj))
})

app.post('/video/getPlaylistElements', jsonParser, function(req, res){
    playlistName = xss(req.body.playlistName)
    if(playlistName!==undefined){
        if(playlistobj.hasOwnProperty(playlistName)){
            res.send(playlistobj[playlistName])
        }
        else{
            res.status(404).send({
                route: '/video/getPlaylistElements',
                method: 'POST',
                message: 'La playlist n\'existe pas'
            })
        }
    }
    else{
        res.status(400).send({
            route: '/video/getPlaylistElements',
            method: 'POST',
            message: 'Paramètres invalides'
        })
    }
})

app.post('/video/addPlaylist', jsonParser, function(req, res){
    playlistName = xss(req.body.playlistName)
    if(playlistName!== undefined){
        if(playlistobj.hasOwnProperty(playlistName)){
            res.status(404).send({
                route: '/video/getPlaylistElements',
                method: 'POST',
                message: 'La playlist existe déjà'
            })
        }
        else{
            playlistobj[playlistName] = []
            console.log(playlistobj)
            fs.writeFile('./var/playlist_video.json',JSON.stringify(playlistobj) ,function (err) {
                if (err) throw err;
                else{
                    res.status(200).send({
                        route: '/video/getPlaylistElements',
                        method: 'POST',
                        message: 'La playlist a bien été ajoutée'
                    })
                }
            })
        }
    }
    else{
        res.status(400).send({
            route: '/video/getPlaylistElements',
            method: 'POST',
            message: 'Paramètres invalides'
        }) 
    }
})

app.post('/video/addPlaylistElement', jsonParser, function(req, res){
    let playlistName = xss(req.body.playlistName)
    let elementURL = xss(req.body.elementURL)
    if(playlistName===undefined || elementURL===undefined){
        res.status(400).send({
            route: '/video/addPlaylistElement',
            method: 'POST',
            message: 'Paramètres invalides'
        }) 
    }
    else if(!playlistobj.hasOwnProperty(playlistName)){
        res.status(404).send({
            route: '/video/addPlaylistElement',
            method: 'POST',
            message: 'La playlist n\'existe pas'
        })
    }
    else if(playlistobj[playlistName].includes(elementURL)){
        res.status(200).send({
            route: '/video/addPlaylistElement',
            method: 'POST',
            message: 'L\'élément est déjà dans la playlist'
        })
    }
    else{
        playlistobj[playlistName].push(elementURL)
        fs.writeFile('./var/playlist_video.json',JSON.stringify(playlistobj) ,function (err) {
            if (err) throw err;
            else{
                res.status(200).send({
                    route: '/video/addPlaylistElement',
                    method: 'POST',
                    message: 'L\'élément a bien été ajoutée'
                })
            }
        })

    }
})

app.delete('/video/deletePlaylistElement', jsonParser, function(req, res){
    let playlistName = xss(req.body.playlistName)
    let elementURL = xss(req.body.elementURL)
    if(playlistName===undefined || elementURL===undefined){
        res.status(400).send({
            route: '/video/deletePlaylistElement',
            method: 'POST',
            message: 'Paramètres invalides'
        }) 
    }
    else if(!playlistobj.hasOwnProperty(playlistName)){
        res.status(404).send({
            route: '/video/deletePlaylistElement',
            method: 'POST',
            message: 'La playlist n\'existe pas'
        })
    }
    else if(!playlistobj[playlistName].includes(elementURL)){
        res.status(200).send({
            route: '/video/deletePlaylistElement',
            method: 'POST',
            message: 'L\'élément n\'est pas dans la playlist'
        })
    }
    else{
        playlistobj[playlistName].splice(playlistobj[playlistName].indexOf(elementURL),1)
        fs.writeFile('./var/playlist_video.json',JSON.stringify(playlistobj) ,function (err) {
            if (err) throw err;
            else{
                console.log(playlistobj)
                res.status(200).send({
                    route: '/video/deletePlaylistElement',
                    method: 'POST',
                    message: 'L\'élément a bien été supprimé'
                })
            }
        })

    }
})
// Récupération des chemins d'accès aux fichiers du dossier de travail et initialisation des requêtes pour chaque dossier
const recupfichier = function(chemin){
    // récupération nom fichiers
    const filenames= fs.readdirSync(path.join(__dirname,`/srv/public/${chemin}`))
    // Pour chaque fichier
    if(filenames.length>0){
        for (let i=0; i<filenames.length; i++)
        // SI c'est un dossier
        if (filenames[i].split('.').length===1){
            let url = `${chemin}/${filenames[i]}`.split(' ').join('%20')
            app.get(url, function(req, res){
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
let playlistobj = JSON.parse(fs.readFileSync('./var/playlist_video.json'))

// Sauvegarde des playlist dans un fichier Json 
const EcrirePlaylist= function(name,song){
    obj = {}
    obj[name]= song
    data= JSON.stringify(obj)
    fs.appendFile('./var/playlist_video.json',data,function (err) {
        if (err) throw err;
    })
}

//EcrirePlaylist('Playlist1',['LesSimpsons','futurama','american dad'])

console.log('lancement du serveur')
app.listen(3000)