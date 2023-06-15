let rememberedSongId = ""; // Variable to store the remembered song ID

    function searchSong() {
      const search = document.getElementById('searchid').value;
      const songtable = document.getElementById('song-table');

      if (search === '*') {
        // Fetch all songs from the API
        fetch('http://127.0.0.1:5000/song?sid=*')
          .then(response => response.json())
          .then(data => {
            songtable.style.display = 'block';
            const songList = document.getElementById('song-list');
            songList.innerHTML = ''; // Clear all data table before adding new data

            data.forEach(song => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${song.song_id}</td>
                <td>${song.song_name}</td>
                <td>${song.listen_count}</td>
                <td>${song.rate}</td>

                <td>
                  <button onclick="showEditForm('${song.song_id}')">Edit</button>
                  <button data-sid="${song.song_id}">Delete</button></td>
                </td>
              `;
              songList.appendChild(tr);
            });
          });
      } else {
        // Fetch song by ID from the API
        fetch(`http://127.0.0.1:5000/song?sid=${search}`)
          .then(response => response.json())
          .then(song => {
            songtable.style.display = 'block';
            const songList = document.getElementById('song-list');
            songList.innerHTML = ''; // Clear all data table before adding new data

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${song.song_id}</td>
              <td>${song.song_name}</td>
              <td>${song.listen_count}</td>
              <td>${song.rate}</td>
              <td>
                <button onclick="showEditForm('${song.song_id}')">Edit</button>
                <button onclick="deleteSong('${song.song_id}')">Delete</button>
              </td>
            `;
            songList.appendChild(tr);
          })
          .catch(error => {
            songtable.style.display = 'none';
            console.log('Song not found:', error);
          });
      }
    }

    function showAddForm() {
      const addForm = document.getElementById('form-to-add');
      addForm.style.display = 'block';
    }

    function showEditForm(songId) {
      const editFormContainer = document.getElementById('edit-form-container');
      const formToPut = document.getElementById('form_to_put');

      const namePut = document.getElementById('nameput');
      const listenPut = document.getElementById('listenput');
      const ratePut = document.getElementById('rateput');

      // Set the song ID in the edit form
      formToPut.setAttribute('data-song-id', songId);

      // Fetch song data by ID from the API
      fetch(`http://127.0.0.1:5000/song?sid=${songId}`)
        .then(response => response.json())
        .then(song => {
          namePut.value = song.song_name;
          listenPut.value = song.listen_count;
          ratePut.value = song.rate;
          editFormContainer.style.display = 'block';
        });

      // Store the songId in the rememberedSongId variable
      rememberedSongId = songId;
    }

         // Delete data
         function deleteSong(song_id) {
        // Send a DELETE request to the API with the sid value
        fetch(`http://127.0.0.1:5000/song`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({song_id: song_id})
        })
        .then(response => {
          // If the request is successful, remove the corresponding table row
          const row = document.querySelector(`#song-list tr[data-sid="${song_id}"]`);
          row.parentNode.removeChild(row);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
        })
        .catch(error => console.error(error));
      }

      // Add an event listener to the song list table
      const songList = document.getElementById('song-list');
      songList.addEventListener('click', (event) => {
        const target = event.target;
        // Check if the clicked element is a delete button
        if (target.tagName === 'BUTTON' && target.textContent === 'Delete') {
          const song_id = target.getAttribute('data-sid');
          deleteSong(song_id);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
          const songtable = document.getElementById('song-table');
          songtable.style.display = 'none';
          setTimeout(() => {
            successMessage.style.display = 'none';
            searchSong();
          }, 2000);
        }
      });
    function handleAddFormSubmit(event) {
      event.preventDefault();

      const form = document.getElementById('form-to-add');
      const song_id = document.getElementById('song_id').value;
      const song_name = document.getElementById('song_name').value;
      const listen_count = document.getElementById('listen_count').value;
      const rate = document.getElementById('rate').value;

      const songData = {
        song_id: song_id,
        song_name: song_name,
        listen_count: listen_count,
        rate: rate
      };

      fetch('http://127.0.0.1:5000/song?sid=*', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(songData)
      })
        .then(response => response.json())
        .then(data => {
          const postFormContainer = document.getElementById('form-to-add');
          const songtable = document.getElementById('song-table');
          const postSuccessMessage = document.getElementById('success-message');
          postSuccessMessage.style.display = 'block';
          songtable.style.display = 'none';
          postFormContainer.style.display = 'none';
          form.reset();
          console.log('Data Posted successfully:', data);
          setTimeout(()=>{
            // postFormContainer.style.display = 'none';
            postSuccessMessage.style.display = 'none';
            // // Refresh the Song list
            searchSong();
          },1000)
        })
        .catch(error => {console.error('Error posting data:', error);
                    const postFormContainer = document.getElementById('form-to-add');
                    // Display the error message to the user
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.textContent = 'Failed to POST Add exist song ID and Job ID, Please!!! ' +'(The main error: ' + error.message +')' ;
                    errorMessage.style.display = 'block';
                    postFormContainer.style.display = 'none';
                    const songtable = document.getElementById('song-table');
                    songtable.style.display = 'none';
                    setTimeout(()=>{
                        postFormContainer.style.display = 'block';
                        errorMessage.style.display = 'none';
                        searchSong();
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
      const songId = form.getAttribute('data-song-id');
      const song_name = document.getElementById('nameput').value;
      const listen_count = document.getElementById('listenput').value;
      const rate = document.getElementById('rateput').value;

      const songData = {
        song_id: songId,
        song_name: song_name,
        listen_count: listen_count,
        rate: rate
      };

      fetch(`http://127.0.0.1:5000/song`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(songData)
      })
        .then(response => response.json())
        .then(data => {
          const editFormContainer = document.getElementById('edit-form-container');
          const songtable = document.getElementById('song-table');
          const putSuccessMessage = document.getElementById('put-success-message');
          putSuccessMessage.style.display = 'block';
          songtable.style.display = 'none';
          editFormContainer.style.display = 'none';
          form.reset();
          console.log('Data updated successfully:', data);
          setTimeout(()=>{
            editFormContainer.style.display = 'none';
            putSuccessMessage.style.display = 'none';
            // Refresh the song list
            searchSong();
          },1000)

        })
        .catch(error => console.error('Error updating data:', error));
    }
    function cancelFormedit() {
      const editForm = document.getElementById('form_to_put');
      editForm.style.display = 'none';
    }


    // Attach event listeners
    document.getElementById('show-form-to-add-song').addEventListener('click', showAddForm);
    document.getElementById('form-to-add').addEventListener('submit', handleAddFormSubmit);
    document.getElementById('form_to_put').addEventListener('submit', handlePutFormSubmit);