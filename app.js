//Initializing the SDK
  window.fbAsyncInit = function() {
    window.APP = {};
    FB.init({
      appId      : '1494278684143737',
      xfbml      : true,
      version    : 'v2.0'
    });
    APP.ACCESSTOKEN = "1494278684143737|aHwXxPJzfU1s9FezQkzEx0hZqaw";
    APP.results = {};
    APP.details = {};
    APP.loaded = -1;
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "http://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  function clearText (which) {
    if (!which) {
      which = 'body';
    }
    document.getElementById(which).innerHTML = '<br />';
  }

  function setText (text, which) {
    if (!which) {
      which = 'body';
    }
    clearText(which);
    document.getElementById(which).innerHTML = document.getElementById(which).innerHTML + text; 
  }

  function appendText (text, which) {
    if (!which) {
      which = 'body';
    }
    document.getElementById(which).innerHTML = document.getElementById(which).innerHTML + text; 
  }

  function loadMessages(start, stop) {
    /* sort the array  */
    APP.results.sort(function(a, b){
      var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
      if (nameA > nameB) //sort string descending
        return -1; 
      if (nameA < nameB)
        return 1;
      return 0; //default return value (no sorting)
    });

    if (APP.loaded === -1){
      document.getElementById('showmore').disabled = "disabled";
      return;
    }
    for (var i = start; i < stop; i++) {
      if (APP.results[i]) {
        appendText(
        '<div class="search-res-row" onclick="getDetails(' + APP.results[i].id + ')">'+
          '<span class="elem"><em>' + (i + 1) + '. ' + APP.results[i].name + '</em></span><br />'+
          '<span class="cat">Category: ' + APP.results[i].category + '</span>'+
          '<br /></div>'+
        '<br><button class="addfav-btn myButton" id="favourite" onclick="addFav(\''+APP.results[i].name+'\','+APP.results[i].id+')">Favourite</button><hr>'
        );
      } else {
        APP.loaded = -1;
        return;
      }
    }
    APP.loaded = stop;
  }
  function addFav(name, id){
    console.log(name); 
    console.log(id); 
    var already = document.getElementById("favourites").innerHTML;    
    already = already + '<div><a class="fav-list" id="'+id+'" onclick=getDetails('+id+')>'+name+'</a><button class="unfav-btn myButton" onclick="unFav('+id+')">Unfavourite</button><hr></div>';
    document.getElementById('favourites').innerHTML=already;
  }

  function unFav (id) {
    var child = document.getElementById( id+'' );
    child.parentNode.remove();
  }

  function showDetails (details) {
    var html = 
      '<div>'+
      '<span>Name: '+details.name+'</span><br />'+
      '<span>About: '+details.about+'</span><br />'+
      '<span>Link: <a target="_blank" href="'+details.link+'">'+details.link+'</a></span>&nbsp;<fb:share-button href="'+details.link+'"></fb:share-button><br />'+
      '<span>Likes: '+details.likes+'</span><br />'+
      '<span>Talking about this: '+details.talking_about_count+'</span><br />'+
      '<fb:like-box href="'+ details.link +'" width="600" colorscheme="light" show_faces="true" header="true" stream="true" share="true" show_border="true"></fb:like-box>';
    if (details.cover && details.cover.source) {
      document.getElementById('details').style.backgroundImage =
        'url(\''+details.cover.source+'\')';
    } else {
      document.getElementById("details").style.backgroundImage = 'url(\'\')';
    }
    html += '</div>';
    setText(html, "details");
    try{
        FB.XFBML.parse(); 
    }catch(ex){}
  }

  function getDetails (id) {
    var urlCall = "/?ids=" + id + "&type=page&access_token=" +
      APP.ACCESSTOKEN;

    setText('Loading...', "details");
    FB.api(urlCall, function(response) {
      if (response.error) {
        setText("Some error happened", "details");
      } else {
        showDetails(response[id]);
      }
    });
  }

  function search() {
    if (!APP) {
      setText("Please wait while FB SDK loads...");
      return;
    }
    
    var query = document.getElementById('searchBox').value;
      urlCall = "/search?q=" + query + "&type=page&access_token=" +
      APP.ACCESSTOKEN;

    setText('Loading...');
    clearText("details");
    document.getElementById("details").style.backgroundImage = '';
    if (query.length === 0) {
      setText("Please enter some search query!");
      return;
    }
    FB.api(urlCall, function(response) {
      //alert("hi");
      APP.results = response.data;
      if (APP.results.length === 0) {
        setText("No results were returned");
      } else {
        APP.loaded = 0;
        document.getElementById('showmore').disabled = false;
        clearText();
       
        loadMessages(0, 30);
        console.log(APP.results);
      }
    });
  }