console.log('la page js est chargée')

const updateChemin = function(e){
    let chemin = e.currentTarget.innerHTML
    let url = $('#chemin').html()
    if(chemin.split('.').length>1){
        $("#video_player").attr("src",`${url}/${chemin}`)   
    }
    else{
        $.ajax({
            type: "GET",   
            url: `${url}/${chemin}`,
            success: function(res){
               $("#list").html("")
            for (let i=0; i<res.length; i++){
                $("#list").append(`<button id="bouton${i}" type="button" draggable="true" class="list-group-item list-group-item-action">${res[i]}</button>`)
                $(`#bouton${i}`).on("click", updateChemin)
            }
            $('#chemin').html(`${url}/${chemin}`)
            id = `${url.split('/').slice(1).join('').split(' ').join('_')}${chemin.split(' ').join('_')}`
            $('#breadcrumbChemin').append(`<li id="${id}" class="breadcrumb-item">${chemin}</li>`)
            },
            error: function(err){
               console.log(err)
            } 
        })
    }
}

const initialisation = function(){
    $.ajax({
        type: "GET",
        url: "/video",
        success: function(res){
            for (let i=0; i<res.length; i++){
                $("#list").append(`<button id="bouton${i}" type="button" draggable="true" class="list-group-item list-group-item-action">${res[i]}</button>`)
                $(`#bouton${i}`).on("click", updateChemin)
            }
            $('#chemin').html('/video')
            $('#breadcrumbChemin').html('<li id=video class="breadcrumb-item">video</li>')
        },
        error: function(err){
            console.log(err)
        }
    })
}

const retourChemin = function(e){
    let url = $('#chemin').html()
    url= url.split('/')
    chemin = url[url.length -1]
    url = url.slice(0,-1).join('/')
    if(url!== ''){
        $.ajax({
            type: "GET",
            url: `${url}`, 
            success: function(res){
                $("#list").html("")
             for (let i=0; i<res.length; i++){
                 $("#list").append(`<button id="bouton${i}" type="button" draggable="true" class="list-group-item list-group-item-action">${res[i]}</button>`)
                 $(`#bouton${i}`).on("click", updateChemin)
             }
             $('#chemin').html(`${url}`)
             id = `${url.split('/').slice(1).join('').split(' ').join('_')}${chemin.split(' ').join('_')}`
             $(`#${id}`).remove()
            },
            error: function(err){
                console.log(err)
            } 
         })
    }

}

const submitPlaylist = function(e){
    let playlistName = $("#playlistName").val()
    $("#add_playlist_form").slideUp()
    $.ajax({
        type: "POST",
        url: '/video/addPlaylist',
        headers: {
            "Content-Type": "application/vnd.api+json"
        },
        data:JSON.stringify({playlistName: playlistName}),
        success: function(res){
            getVideoPlaylists()
        },
        error: function(err){
            console.log(err)
        }
    })
}

const getVideoPlaylists = function(){
    $.ajax({
        type: 'GET',
        url: '/videoPlaylist',  
        success: function(res){
            $("#videoPlaylist").html("")
             for (let i=0; i<res.length; i++){
                 $("#videoPlaylist").append(`<button id="playlistbouton${i}" type="button" draggable="true" class="list-group-item list-group-item-action">${res[i]}</button>`)
                 $(`#playlistbouton${i}`).on('click', getPlaylistElements)
             }
             $("#videoPlaylist").append('<button type=button id="add_playlist" class="list-group-item list-group-item-action">Ajouter une playlist + </button>')
             $("#add_playlist").on('click', showPlaylistForm)
        },
        error: function(err){
            console.log(err)
        }})
}

const getPlaylistElements = function(e){
    console.log(e.currentTarget.innerHTML)
    $.ajax({
        type:'POST',
        url: '/video/getPlaylistElements',
        headers: {
            "Content-Type": "application/vnd.api+json"
        },
        data: JSON.stringify({playlistName: e.currentTarget.innerHTML}),
        success: function(res){
            $("#videoPlaylist").html("")
            for (let i=0; i<res.length; i++){
                let split = res[i].split('/')
                let titre = split.pop()
                let url = split.join('/')
                console.log(split, titre, url)
                $("#videoPlaylist").append(`<button id="bouton_playlist${i}" type="button" draggable="true" class="list-group-item list-group-item-action">${titre}</button><div id="playlist_url${i}" hidden>${url}</div>`)
                $(`#bouton_playlist${i}`).on("click", updatePlaylist)
            }
        },
        errror: function(err){
            console.log(err)
        }
    })
}

const updatePlaylist = function(e){
    let id = e.currentTarget.id.split('bouton_playlist').pop()
    url = $(`#playlist_url${id}`).html()+'/'+$(`#bouton_playlist${id}`).html()
    $("#video_player").attr("src",`${url}`)
}

const showPlaylistForm = function(e){
    if($("#add_playlist_form").css("display")=="block"){
        $("#add_playlist_form").slideUp()
    }
    else{
        $("#add_playlist_form").slideDown()
    }
}
$("#back").on("click", retourChemin)
$("#back_playlist").on("click", getVideoPlaylists)
$("#submit_playlist").on('click', submitPlaylist)
initialisation()
getVideoPlaylists()