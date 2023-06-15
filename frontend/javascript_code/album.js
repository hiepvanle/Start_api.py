let rememberedAlbumId = ""; // Variable to store the remembered album ID

    function searchAlbum() {
      const search = document.getElementById('searchid').value;
      const albumtable = document.getElementById('album-table');

      if (search === '*') {
        // Fetch all albums from the API
        fetch('http://127.0.0.1:5000/album?aid=*')
          .then(response => response.json())
          .then(data => {
            albumtable.style.display = 'block';
            const albumList = document.getElementById('album-list');
            albumList.innerHTML = ''; // Clear all data table before adding new data

            data.forEach(album => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${album.album_id}</td>
                <td>${album.album_name}</td>
                <td>${album.date_release_album}</td>
                <td>${album.album_description}</td>

                <td>
                  <button onclick="showEditForm('${album.album_id}')">Edit</button>
                  <button data-aid="${album.album_id}">Delete</button></td>
                </td>
              `;
              albumList.appendChild(tr);
            });
          });
      } else {
        // Fetch album by ID from the API
        fetch(`http://127.0.0.1:5000/album?aid=${search}`)
          .then(response => response.json())
          .then(album => {
            albumtable.style.display = 'block';
            const albumList = document.getElementById('album-list');
            albumList.innerHTML = ''; // Clear all data table before adding new data

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${album.album_id}</td>
              <td>${album.album_name}</td>
              <td>${album.date_release_album}</td>
              <td>${album.album_description}</td>
              <td>
                <button onclick="showEditForm('${album.album_id}')">Edit</button>
                <button onclick="deleteAlbum('${album.album_id}')">Delete</button>
              </td>
            `;
            albumList.appendChild(tr);
          })
          .catch(error => {
            albumtable.style.display = 'none';
            console.log('Album not found:', error);
          });
      }
    }

    function showAddForm() {
      const addForm = document.getElementById('form-to-add');
      addForm.style.display = 'block';
    }

    function showEditForm(albumId) {
      const editFormContainer = document.getElementById('edit-form-container');
      const formToPut = document.getElementById('form_to_put');

      const albumnamePut = document.getElementById('albumnameput');
      const datereleasealbumPut = document.getElementById('datereleasealbumput');
      const albumdescriptionPut = document.getElementById('albumdescriptionput');

      // Set the album ID in the edit form
      formToPut.setAttribute('data-album-id', albumId);

      // Fetch album data by ID from the API
      fetch(`http://127.0.0.1:5000/album?aid=${albumId}`)
        .then(response => response.json())
        .then(album => {
          albumnamePut.value = album.album_name;
          datereleasealbumPut.value = album.date_release_album;
          albumdescriptionPut.value = album.album_description;
          editFormContainer.style.display = 'block';
        });

      // Store the albumId in the rememberedAlbumId variable
      rememberedAlbumId = albumId;
    }

         // Delete data
         function deleteAlbum(album_id) {
        // Send a DELETE request to the API with the eid value
        fetch(`http://127.0.0.1:5000/album`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({album_id: album_id})
        })
        .then(response => {
          // If the request is successful, remove the corresponding table row
          const row = document.querySelector(`#album-list tr[data-aid="${album_id}"]`);
          row.parentNode.removeChild(row);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
        })
        .catch(error => console.error(error));
      }

      // Add an event listener to the album list table
      const albumList = document.getElementById('album-list');
      albumList.addEventListener('click', (event) => {
        const target = event.target;
        // Check if the clicked element is a delete button
        if (target.tagName === 'BUTTON' && target.textContent === 'Delete') {
          const album_id = target.getAttribute('data-aid');
          deleteAlbum(album_id);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
          const albumtable = document.getElementById('album-table');
          albumtable.style.display = 'none';
          setTimeout(() => {
            successMessage.style.display = 'none';
            searchAlbum();
          }, 2000);
        }
      });
    function handleAddFormSubmit(event) {
      event.preventDefault();

      const form = document.getElementById('form-to-add');
      const album_id = document.getElementById('album_id').value;
      const album_name = document.getElementById('album_name').value;
      const date_release_album = document.getElementById('date_release_album').value;
      const album_description = document.getElementById('album_description').value;

      const albumData = {
        album_id: album_id,
        album_name: album_name,
        date_release_album: date_release_album,
        album_description: album_description
      };

      fetch('http://127.0.0.1:5000/album?aid=*', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(albumData)
      })
        .then(response => response.json())
        .then(data => {
          const postFormContainer = document.getElementById('form-to-add');
          const albumtable = document.getElementById('album-table');
          const postSuccessMessage = document.getElementById('success-message');
          postSuccessMessage.style.display = 'block';
          albumtable.style.display = 'none';
          postFormContainer.style.display = 'none';
          form.reset();
          console.log('Data Posted successfully:', data);
          setTimeout(()=>{
            // postFormContainer.style.display = 'none';
            postSuccessMessage.style.display = 'none';
            // // Refresh the album list
            searchAlbum();
          },1000)
        })
        .catch(error => {console.error('Error posting data:', error);
                    const postFormContainer = document.getElementById('form-to-add');
                    // Display the error message to the user
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.textContent = 'Failed to POST Add exist Album ID, Please!!! ' +'(The main error: ' + error.message +')' ;
                    errorMessage.style.display = 'block';
                    postFormContainer.style.display = 'none';
                    const albumtable = document.getElementById('album-table');
                    albumtable.style.display = 'none';
                    setTimeout(()=>{
                        postFormContainer.style.display = 'block';
                        errorMessage.style.display = 'none';
                        searchAlbum();
                    },2000);
                });
    }
    function cancelForm() {
      const addForm = document.getElementById('form-to-add');
      addForm.style.display = 'none';
    }

    function handlePutFormSubmit(event) {
      event.preventDefault();

      const form = document.getElementById('form_to_put');
      const albumId = form.getAttribute('data-album-id');
      const album_name = document.getElementById('albumput').value;
      const date_release_album = document.getElementById('releaseput').value;
      const album_description = document.getElementById('descriptionput').value;

      const albumData = {
        album_id: albumId,
        album_name: album_name,
        date_release_album: date_release_album,
        album_description: album_description
      };

      fetch(`http://127.0.0.1:5000/album`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(albumData)
      })
        .then(response => response.json())
        .then(data => {
          const editFormContainer = document.getElementById('edit-form-container');
          const albumtable = document.getElementById('album-table');
          const putSuccessMessage = document.getElementById('put-success-message');
          putSuccessMessage.style.display = 'block';
          albumtable.style.display = 'none';
          editFormContainer.style.display = 'none';
          form.reset();
          console.log('Data updated successfully:', data);
          setTimeout(()=>{
            editFormContainer.style.display = 'none';
            putSuccessMessage.style.display = 'none';
            // Refresh the album list
            searchAlbum();
          },1000)

        })
        .catch(error => console.error('Error updating data:', error));
    }
    function cancelFormedit() {
      const editForm = document.getElementById('form_to_put');
      editForm.style.display = 'none';
    }


    // Attach event listeners
    document.getElementById('show-form-to-add-album').addEventListener('click', showAddForm);
    document.getElementById('form-to-add').addEventListener('submit', handleAddFormSubmit);
    document.getElementById('form_to_put').addEventListener('submit', handlePutFormSubmit);