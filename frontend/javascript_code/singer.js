let rememberedSingerId = ""; // Variable to store the remembered singer ID

    function searchSinger() {
      const search = document.getElementById('searchid').value;
      const singertable = document.getElementById('singer-table');

      if (search === '*') {
        // Fetch all singers from the API
        fetch('http://127.0.0.1:5000/singer?sgid=*')
          .then(response => response.json())
          .then(data => {
            singertable.style.display = 'block';
            const singerList = document.getElementById('singer-list');
            singerList.innerHTML = ''; // Clear all data table before adding new data

            data.forEach(singer => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${singer.singer_id}</td>
                <td>${singer.singer_name}</td>
                <td>${singer.singer_description}</td>
                <td>${singer.day_of_birth}</td>
                <td>${singer.hometown}</td>

                <td>
                  <button onclick="showEditForm('${singer.singer_id}')">Edit</button>
                  <button data-sgid="${singer.singer_id}">Delete</button></td>
                </td>
              `;
              singerList.appendChild(tr);
            });
          });
      } else {
        // Fetch singer by ID from the API
        fetch(`http://127.0.0.1:5000/singer?sgid=${search}`)
          .then(response => response.json())
          .then(singer => {
            singertable.style.display = 'block';
            const singerList = document.getElementById('singer-list');
            singerList.innerHTML = ''; // Clear all data table before adding new data

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${singer.singer_id}</td>
                <td>${singer.singer_name}</td>
                <td>${singer.singer_description}</td>
                <td>${singer.day_of_birth}</td>
                <td>${singer.hometown}</td>
              <td>
                <button onclick="showEditForm('${singer.singer_id}')">Edit</button>
                <button onclick="deleteSinger('${singer.singer_id}')">Delete</button>
              </td>
            `;
            singerList.appendChild(tr);
          })
          .catch(error => {
            singertable.style.display = 'none';
            console.log('Song not found:', error);
          });
      }
    }

    function showAddForm() {
      const addForm = document.getElementById('form-to-add');
      addForm.style.display = 'block';
    }

    function showEditForm(singerId) {
      const editFormContainer = document.getElementById('edit-form-container');
      const formToPut = document.getElementById('form_to_put');

      const namePut = document.getElementById('nameput');
      const descriptionPut = document.getElementById('descriptionput');
      const day_of_birth = document.getElementById('birthdateput');
      const hometown = document.getElementById('hometownput');

      // Set the singer ID in the edit form
      formToPut.setAttribute('data-singer-id', singerId);

      // Fetch singer data by ID from the API
      fetch(`http://127.0.0.1:5000/singer?sgid=${singerId}`)
        .then(response => response.json())
        .then(singer => {
          namePut.value = singer.singer_name;
          descriptionPut.value = singer.singer_description;
          day_of_birth.value = singer.day_of_birth;
          hometown.value = singer.hometown;

          editFormContainer.style.display = 'block';
        });

      // Store the singerId in the rememberedSingerId variable
      rememberedSingerId = singerId;
    }

         // Delete data
         function deleteSinger(singer_id) {
        // Send a DELETE request to the API with the sgid value
        fetch(`http://127.0.0.1:5000/singer`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({singer_id: singer_id})
        })
        .then(response => {
          // If the request is successful, remove the corresponding table row
          const row = document.querySelector(`#singer-list tr[data-sgid="${singer_id}"]`);
          row.parentNode.removeChild(row);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
        })
        .catch(error => console.error(error));
      }

      // Add an event listener to the singer list table
      const singerList = document.getElementById('singer-list');
      singerList.addEventListener('click', (event) => {
        const target = event.target;
        // Check if the clicked element is a delete button
        if (target.tagName === 'BUTTON' && target.textContent === 'Delete') {
          const song_id = target.getAttribute('data-sgid');
          deleteSinger(song_id);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
          const singertable = document.getElementById('singer-table');
          singertable.style.display = 'none';
          setTimeout(() => {
            successMessage.style.display = 'none';
          Singer();
          }, 2000);
        }
      });
    function handleAddFormSubmit(event) {
      event.preventDefault();

      const form = document.getElementById('form-to-add');
      const singer_id = document.getElementById('singer_id').value;
      const singer_name = document.getElementById('singer_name').value;
      const singer_description = document.getElementById('singer_description').value;
      const day_of_birth = document.getElementById('day_of_birth').value;
      const hometown = document.getElementById('hometown').value;


      const singerData = {
        singer_id: singer_id,
        singer_name: singer_name,
        singer_description: singer_description,
        day_of_birth: day_of_birth,
        hometown: hometown
      };

      fetch('http://127.0.0.1:5000/singer?sgid=*', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(singerData)
      })
        .then(response => response.json())
        .then(data => {
          const postFormContainer = document.getElementById('form-to-add');
          const singertable = document.getElementById('singer-table');
          const postSuccessMessage = document.getElementById('success-message');
          postSuccessMessage.style.display = 'block';
          singertable.style.display = 'none';
          postFormContainer.style.display = 'none';
          form.reset();
          console.log('Data Posted successfully:', data);
          setTimeout(()=>{
            // postFormContainer.style.display = 'none';
            postSuccessMessage.style.display = 'none';
            // // Refresh the singer list
            searchSinger();
          },1000)
        })
        .catch(error => {console.error('Error posting data:', error);
                    const postFormContainer = document.getElementById('form-to-add');
                    // Display the error message to the user
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.textContent = 'Failed to POST Add exist Singer ID, Please!!! ' +'(The main error: ' + error.message +')' ;
                    errorMessage.style.display = 'block';
                    postFormContainer.style.display = 'none';
                    const singertable = document.getElementById('singer-table');
                    singertable.style.display = 'none';
                    setTimeout(()=>{
                        postFormContainer.style.display = 'block';
                        errorMessage.style.display = 'none';
                        searchSinger();
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
      const singerId = form.getAttribute('data-singer-id');
      const singer_name = document.getElementById('nameput').value;
      const singer_description = document.getElementById('descriptionput').value;
      const day_of_birth = document.getElementById('birthdateput').value;
      const hometown = document.getElementById('hometownput').value;

      const singerData = {
        singer_id: singerId,
        singer_name: singer_name,
        singer_description: singer_description,
        day_of_birth: day_of_birth,
        hometown: hometown
      };

      fetch(`http://127.0.0.1:5000/singer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(singerData)
      })
        .then(response => response.json())
        .then(data => {
          const editFormContainer = document.getElementById('edit-form-container');
          const singertable = document.getElementById('singer-table');
          const putSuccessMessage = document.getElementById('put-success-message');
          putSuccessMessage.style.display = 'block';
          singertable.style.display = 'none';
          editFormContainer.style.display = 'none';
          form.reset();
          console.log('Data updated successfully:', data);
          setTimeout(()=>{
            editFormContainer.style.display = 'none';
            putSuccessMessage.style.display = 'none';
            // Refresh the singer list
            searchSinger();
          },1000)

        })
        .catch(error => console.error('Error updating data:', error));
    }
    function cancelFormedit() {
      const editForm = document.getElementById('form_to_put');
      editForm.style.display = 'none';
    }


    // Attach event listeners
    document.getElementById('show-form-to-add-singer').addEventListener('click', showAddForm);
    document.getElementById('form-to-add').addEventListener('submit', handleAddFormSubmit);
    document.getElementById('form_to_put').addEventListener('submit', handlePutFormSubmit);