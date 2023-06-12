var AlbumAPI = 'http://127.0.0.1:5000/album?aid=*';

function begin() {
  GetAlbumApi(renderAlbum);

  createform();
}


begin();

function GetAlbumApi(callback) {
  fetch(AlbumAPI)
    .then(function(response) {
      return response.json();
    })
    .then(callback);
}

function createAlbum (data, callback) {
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


function renderAlbum(albums) {
  var ListAlbumBlock = document.querySelector('#Album-list');
  var htmls = albums.map(function(album) {
    return `
      <li>
        <h4>${album.album_id}</h4>
        <h4>${album.album_name}</h4>
        <h4>${album.album_description}</h4>
        <h4>${album.album_date}</h4>
        <button>Delete</button>
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