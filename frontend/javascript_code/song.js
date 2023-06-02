let rememberedEmployeeId = ""; // Variable to store the remembered employee ID

    function searchSong() {
      const search = document.getElementById('searchid').value;
      const song_table = document.getElementById('song_table');

      if (search === '*') {
        // Fetch all songs from the API
        fetch('http://127.0.0.1:5000/song')
          .then(response => response.json())
          .then(data => {
            song_table.style.display = 'block';
            const songList = document.getElementById('song_list');
            songList.innerHTML = ''; // Clear all data table before adding new data

            data.forEach(song => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${song.song_id}</td>
                <td>${song.song_name}</td>
                <td>${song.type_id}</td>
                <td>${song.song_writer_id}</td>
                <td>${song.listen_count}</td>
                <td>${song.rate}</td>
                <td>
                  <button onclick="showEditForm('${song.song_id}')">Edit</button>
                  <button data-song_id="${song.song_id}">Delete</button></td>
                </td>
              `;
              songList.appendChild(tr);
            });
          });
      } else {
        // Fetch song by ID from the API
        fetch(`http://127.0.0.1:5000/song=${search}`)
          .then(response => response.json())
          .then(song => {
            song_table.style.display = 'block';
            const songList = document.getElementById('song_list');
            songList.innerHTML = ''; // Clear all data table before adding new data

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${song.song_id}</td>
              <td>${song.song_name}</td>
              <td>${song.type_id}</td>
              <td>${song.song_writer_id}</td>
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
            song_table.style.display = 'none';
            console.log('song not found:', error);
          });
      }
    }

    function showAddForm() {
      const addForm = document.getElementById('form-to-add');
      addForm.style.display = 'block';
    }

    function showEditForm(song_id) {
      const editFormContainer = document.getElementById('edit-form-container');
      const formToPut = document.getElementById('form_to_put');

      const song_name_put = document.getElementById('song_name_put');
      const listen_count_put = document.getElementById('listen_count_put');
      const rate_put = document.getElementById('rate_put');

      // Set the employee ID in the edit form
      formToPut.setAttribute('data-song-id', song_id);

      // Fetch song data by ID from the API
      fetch('http://127.0.0.1:5000/song')
        .then(response => response.json())
        .then(song => {
          song_name_put.value = song.song_name;
          listen_count_put.value = song.listen_count;
          rate_put.value = song.rate;
          editFormContainer.style.display = 'block';
        });

      // Store the employeeId in the rememberedEmployeeId variable
      rememberedSongId = song_id;
    }

         // Delete data
         function deleteSong(song_id) {
        // Send a DELETE request to the API with the eid value
        fetch(`http://127.0.0.1:5000/song`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({song_id: song_id})
        })
        .then(response => {
          // If the request is successful, remove the corresponding table row
          const row = document.querySelector(`#song-list tr[data-song_id="${song_id}"]`);
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
          const song_id = target.getAttribute('data-song_id');
          deleteSong(song_id);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
          const song_table = document.getElementById('song-table');
          song_table.style.display = 'none';
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
      const type_id = document.getElementById('type_id').value;
      const song_writer_id = document.getElementById('song_writer_id').value;
      const listen_count = document.getElementById('listen_count').value;
      const rate = document.getElementById('rate').value;

      const songData = {
        song_id: song_id,
        song_name: song_name,
        type_id: type_id,
        song_writer_id: song_writer_id,
        listen_count: listen_count,
        rate: rate
      };

      fetch('http://127.0.0.1:5000/song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(songData)
      })
        .then(response => response.json())
        .then(data => {
          const postFormContainer = document.getElementById('form-to-add');
          const song_table = document.getElementById('song_table');
          const postSuccessMessage = document.getElementById('success-message');
          postSuccessMessage.style.display = 'block';
          song_table.style.display = 'none';
          postFormContainer.style.display = 'none';
          form.reset();
          console.log('Data Posted successfully:', data);
          setTimeout(()=>{
            // postFormContainer.style.display = 'none';
            postSuccessMessage.style.display = 'none';
            // // Refresh the employee list
            searchSong();
          },1000)
        })
        .catch(error => {console.error('Error posting data:', error);
                    const postFormContainer = document.getElementById('form-to-add');
                    // Display the error message to the user
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.textContent = 'Failed to POST Add exist Song ID and Type ID, Please!!! ' +'(The main error: ' + error.message +')' ;
                    errorMessage.style.display = 'block';
                    postFormContainer.style.display = 'none';
                    const song_table = document.getElementById('song_table');
                    song_table.style.display = 'none';
                    setTimeout(()=>{
                        postFormContainer.style.display = 'block';
                        errorMessage.style.display = 'none';
                        searchSong();
                    },2000);
                });
    }

    function handlePutFormSubmit(event) {
      event.preventDefault();

      const form = document.getElementById('form_to_put');
      const song_id = form.getAttribute('data-song_id');
      const song_name = document.getElementById('song_name_put').value;
      const type_id = document.getElementById('type_id_put').value;
      const song_writer_id = document.getElementById('song_writer_id_put').value;
      const listen_count = document.getElementById('listen_count_put').value;
      const rate = document.getElementById('rate_put').value;

      const songData = {
        song_id:song_id,
        song_name: song_name,
        type_id: type_id,
        song_writer_id: song_writer_id,
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
          const song_table = document.getElementById('song_table');
          const putSuccessMessage = document.getElementById('put-success-message');
          putSuccessMessage.style.display = 'block';
          song_table.style.display = 'none';
          editFormContainer.style.display = 'none';
          form.reset();
          console.log('Data updated successfully:', data);
          setTimeout(()=>{
            editFormContainer.style.display = 'none';
            putSuccessMessage.style.display = 'none';
            // Refresh the employee list
            searchEmployee();
          },1000)

        })
        .catch(error => console.error('Error updating data:', error));
    }

    // Attach event listeners
    document.getElementById('show-form-to-add-employee').addEventListener('click', showAddForm);
    document.getElementById('form-to-add').addEventListener('submit', handleAddFormSubmit);
    document.getElementById('form_to_put').addEventListener('submit', handlePutFormSubmit);