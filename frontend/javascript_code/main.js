let rememberedMainId = ""; // Variable to store the remembered main ID

    function searchMain() {
      const search = document.getElementById('searchid').value;
      const maintable = document.getElementById('main-table');

      if (search === '*') {
        // Fetch all mains from the API
        fetch('http://127.0.0.1:5000/begin?full=*')
          .then(response => response.json())
          .then(data => {
            maintable.style.display = 'block';
            const mainList = document.getElementById('main-list');
            mainList.innerHTML = ''; // Clear all data table before adding new data

            data.forEach(main => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${main.song_id}</td>
                <td>${main.singer_id}</td>
                <td>${main.album_id}</td>
                <td>${main.date}</td>
                <td>${main.location}</td>

              `;
              mainList.appendChild(tr);
            });
          });
      } else {
        // Fetch main by ID from the API
        fetch(`http://127.0.0.1:5000/main?sid=${search}`)
          .then(response => response.json())
          .then(main => {
            maintable.style.display = 'block';
            const mainList = document.getElementById('main-list');
            mainList.innerHTML = ''; // Clear all data table before adding new data

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${main.song_id}</td>
              <td>${main.singer_id}</td>
              <td>${main.album_id}</td>
              <td>${main.date}</td>
              <td>${main.location}</td>
            `;
            mainList.appendChild(tr);
          })
          .catch(error => {
            maintable.style.display = 'none';
            console.log('Main not found:', error);
          });
          fetch(`http://127.0.0.1:5000/main?sgid=${search}`)
          .then(response => response.json())
          .then(main => {
            maintable.style.display = 'block';
            const mainList = document.getElementById('main-list');
            mainList.innerHTML = ''; // Clear all data table before adding new data

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${main.song_id}</td>
              <td>${main.singer_id}</td>
              <td>${main.album_id}</td>
              <td>${main.date}</td>
              <td>${main.location}</td>
            `;
            mainList.appendChild(tr);
          })
          .catch(error => {
            maintable.style.display = 'none';
            console.log('Main not found:', error);
          });
          fetch(`http://127.0.0.1:5000/main?aid=${search}`)
          .then(response => response.json())
          .then(main => {
            maintable.style.display = 'block';
            const mainList = document.getElementById('main-list');
            mainList.innerHTML = ''; // Clear all data table before adding new data

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${main.song_id}</td>
              <td>${main.singer_id}</td>
              <td>${main.album_id}</td>
              <td>${main.date}</td>
              <td>${main.location}</td>
            `;
            mainList.appendChild(tr);
          })
          .catch(error => {
            maintable.style.display = 'none';
            console.log('Main not found:', error);
          });
      }
    }

    function showAddForm() {
      const addForm = document.getElementById('form-to-add');
      addForm.style.display = 'block';
    }

    function showEditForm(mainId) {
      const editFormContainer = document.getElementById('edit-form-container');
      const formToPut = document.getElementById('form_to_put');

      const namePut = document.getElementById('nameput');
      const listenPut = document.getElementById('listenput');
      const ratePut = document.getElementById('rateput');

      // Set the main ID in the edit form
      formToPut.setAttribute('data-main-id', mainId);

      // Fetch main data by ID from the API
      fetch(`http://127.0.0.1:5000/main?sid=${mainId}`)
        .then(response => response.json())
        .then(main => {
          namePut.value = main.main_name;
          listenPut.value = main.listen_count;
          ratePut.value = main.rate;
          editFormContainer.style.display = 'block';
        });

      // Store the mainId in the rememberedMainId variable
      rememberedMainId = mainId;
    }

         // Delete data
         function deleteMain(main_id) {
        // Send a DELETE request to the API with the sid value
        fetch(`http://127.0.0.1:5000/main`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({main_id: main_id})
        })
        .then(response => {
          // If the request is successful, remove the corresponding table row
          const row = document.querySelector(`#main-list tr[data-sid="${main_id}"]`);
          row.parentNode.removeChild(row);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
        })
        .catch(error => console.error(error));
      }

      // Add an event listener to the main list table
      const mainList = document.getElementById('main-list');
      mainList.addEventListener('click', (event) => {
        const target = event.target;
        // Check if the clicked element is a delete button
        if (target.tagName === 'BUTTON' && target.textContent === 'Delete') {
          const main_id = target.getAttribute('data-sid');
          deleteMain(main_id);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
          const maintable = document.getElementById('main-table');
          maintable.style.display = 'none';
          setTimeout(() => {
            successMessage.style.display = 'none';
            searchMain();
          }, 2000);
        }
      });
    function handleAddFormSubmit(event) {
      event.preventDefault();

      const form = document.getElementById('form-to-add');
      const main_id = document.getElementById('main_id').value;
      const main_name = document.getElementById('main_name').value;
      const listen_count = document.getElementById('listen_count').value;
      const rate = document.getElementById('rate').value;

      const mainData = {
        main_id: main_id,
        main_name: main_name,
        listen_count: listen_count,
        rate: rate
      };

      fetch('http://127.0.0.1:5000/main?sid=*', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mainData)
      })
        .then(response => response.json())
        .then(data => {
          const postFormContainer = document.getElementById('form-to-add');
          const maintable = document.getElementById('main-table');
          const postSuccessMessage = document.getElementById('success-message');
          postSuccessMessage.style.display = 'block';
          maintable.style.display = 'none';
          postFormContainer.style.display = 'none';
          form.reset();
          console.log('Data Posted successfully:', data);
          setTimeout(()=>{
            // postFormContainer.style.display = 'none';
            postSuccessMessage.style.display = 'none';
            // // Refresh the Main list
            searchMain();
          },1000)
        })
        .catch(error => {console.error('Error posting data:', error);
                    const postFormContainer = document.getElementById('form-to-add');
                    // Display the error message to the user
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.textContent = 'Failed to POST Add exist main ID and Job ID, Please!!! ' +'(The main error: ' + error.message +')' ;
                    errorMessage.style.display = 'block';
                    postFormContainer.style.display = 'none';
                    const maintable = document.getElementById('main-table');
                    maintable.style.display = 'none';
                    setTimeout(()=>{
                        postFormContainer.style.display = 'block';
                        errorMessage.style.display = 'none';
                        searchMain();
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
      const mainId = form.getAttribute('data-main-id');
      const main_name = document.getElementById('nameput').value;
      const listen_count = document.getElementById('listenput').value;
      const rate = document.getElementById('rateput').value;

      const mainData = {
        main_id: mainId,
        main_name: main_name,
        listen_count: listen_count,
        rate: rate
      };

      fetch(`http://127.0.0.1:5000/main`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mainData)
      })
        .then(response => response.json())
        .then(data => {
          const editFormContainer = document.getElementById('edit-form-container');
          const maintable = document.getElementById('main-table');
          const putSuccessMessage = document.getElementById('put-success-message');
          putSuccessMessage.style.display = 'block';
          maintable.style.display = 'none';
          editFormContainer.style.display = 'none';
          form.reset();
          console.log('Data updated successfully:', data);
          setTimeout(()=>{
            editFormContainer.style.display = 'none';
            putSuccessMessage.style.display = 'none';
            // Refresh the main list
            searchMain();
          },1000)

        })
        .catch(error => console.error('Error updating data:', error));
    }
    function cancelFormedit() {
      const editForm = document.getElementById('form_to_put');
      editForm.style.display = 'none';
    }
    var video = document.getElementById("myVideo");
         var btn = document.getElementById("myBtn");

         function myFunction() {
            if (video.paused) {
                video.play();
                btn.innerHTML = Pause;
            }
            else {
                video.pause();
                btn.innerHTML = Play;
            }
         }


    // Attach event listeners
    document.getElementById('show-form-to-add-main').addEventListener('click', showAddForm);
    document.getElementById('form-to-add').addEventListener('submit', handleAddFormSubmit);
    document.getElementById('form_to_put').addEventListener('submit', handlePutFormSubmit);