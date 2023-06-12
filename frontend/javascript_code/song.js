var SongAPI = 'http://127.0.0.1:5000/song?songid=*';

begin();

function begin() {
  GetSongApi(renderSong);

  createform();
}


function GetSongApi(callback) {
  fetch(SongAPI)
    .then(function(response) {
      return response.json();
    })
    .then(callback);
}

function createSong (data, callback) {
    var options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(data)
    };
    
    fetch(AlbumAPI, options)
        .then(function(response) {
            response.json();
        })
        .then(callback);
}


function renderAlbum(songs) {
  var ListAlbumBlock = document.querySelector('#Album-list');
  var htmls = songs.map(function(song) {
    return `
      <li>
        <h4>${singe.singer_id}</h4>
        <h4>${singer.singer_name}</h4>
        <h4>${singer.singer_description}</h4>
        <h4>${singer.hometown}</h4>
        <h4>${singer.date_of_birth}</h4>
      </li>
    `;
  });
  ListAlbumBlock.innerHTML = htmls.join('');
}

function createform() {
    var createBtn = document.querySelector('#create');
    createBtn.onclick = function() {
      var album_name = document.querySelector('input[name="name"]').value;
      var album_description = document.querySelector('input[name="description"]').value;
      var album_id = document.querySelector('input[name=ID]').value;
      var album_date = document.querySelector('input[name=date]').value;
      var formData = {
        album_id: album_id,
        album_name: album_name,
        album_description: album_description,
        album_date: album_date
      };
      createAlbum(formData);
    };
  }