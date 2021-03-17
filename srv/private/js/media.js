console.log('la page js est chargée')

const updateChemin = function(e){
    let chemin = e.currentTarget.innerHTML
    url = $('#chemin').html()
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
                $("#list").append(`<button id="bouton1" type="button" class="list-group-item list-group-item-action">${res[i]}</button>`)
            }
            $(".list-group-item").on("click", updateChemin)
            $('#chemin').html(`${url}/${chemin}`)
            id = `${url.split('/').slice(1).join('')}${chemin}`
            $('#breadcrumbChemin').append(`<li id=${id} class="breadcrumb-item">${chemin}</li>`)
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
                $("#list").append(`<button id="bouton1" type="button" class="list-group-item list-group-item-action">${res[i]}</button>`)
            }
            $(".list-group-item").on("click", updateChemin)
            $('#chemin').html('/video')
            $('#breadcrumbChemin').html('<li id=video class="breadcrumb-item">video</li>')
        },
        error: function(err){
            console.log(err)
        }
    })
}

const retourChemin = function(e){
    url = $('#chemin').html()
    url= url.split('/')
    console.log(url)
    chemin = url[url.length -1]
    url = url.slice(0,-1).join('/')
    console.log(url)
    if(url!== ''){
        $.ajax({
            type: "GET",
            url: `${url}`,
            success: function(res){
                $("#list").html("")
             for (let i=0; i<res.length; i++){
                 $("#list").append(`<button id="bouton1" type="button" class="list-group-item list-group-item-action">${res[i]}</button>`)
             }
             $(".list-group-item").on("click", updateChemin)
             $('#chemin').html(`${url}`)
             id = `${url.split('/').slice(1).join('')}${chemin}`
             $(`#${id}`).remove()
            },
            error: function(err){
                console.log(err)
            } 
         })
    }

}
$("#back").on("click", retourChemin)
initialisation()
