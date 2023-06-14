let rememberedEmployeeId = ""; // Variable to store the remembered employee ID

    function searchEmployee() {
      const search = document.getElementById('searchid').value;
      const employeetable = document.getElementById('employee-table');

      if (search === '*') {
        // Fetch all employees from the API
        fetch('http://127.0.0.1:5000/song?sid=*')
          .then(response => response.json())
          .then(data => {
            employeetable.style.display = 'block';
            const employeeList = document.getElementById('employee-list');
            employeeList.innerHTML = ''; // Clear all data table before adding new data

            data.forEach(employee => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${employee.song_id}</td>
                <td>${employee.song_name}</td>
                <td>${employee.listen_count}</td>
                <td>${employee.rate}</td>

                <td>
                  <button onclick="showEditForm('${employee.song_id}')">Edit</button>
                  <button data-eid="${employee.song_id}">Delete</button></td>
                </td>
              `;
              employeeList.appendChild(tr);
            });
          });
      } else {
        // Fetch employee by ID from the API
        fetch(`http://127.0.0.1:5000/song?sid=${search}`)
          .then(response => response.json())
          .then(employee => {
            employeetable.style.display = 'block';
            const employeeList = document.getElementById('employee-list');
            employeeList.innerHTML = ''; // Clear all data table before adding new data

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${employee.song_id}</td>
              <td>${employee.song_name}</td>
              <td>${employee.listen_count}</td>
              <td>${employee.rate}</td>
              <td>
                <button onclick="showEditForm('${employee.song_id}')">Edit</button>
                <button onclick="deleteEmployee('${employee.song_id}')">Delete</button>
              </td>
            `;
            employeeList.appendChild(tr);
          })
          .catch(error => {
            employeetable.style.display = 'none';
            console.log('Song not found:', error);
          });
      }
    }

    function showAddForm() {
      const addForm = document.getElementById('form-to-add');
      addForm.style.display = 'block';
    }

    function showEditForm(employeeId) {
      const editFormContainer = document.getElementById('edit-form-container');
      const formToPut = document.getElementById('form_to_put');

      const namePut = document.getElementById('nameput');
      const listenPut = document.getElementById('listenput');
      const ratePut = document.getElementById('rateput');

      // Set the employee ID in the edit form
      formToPut.setAttribute('data-employee-id', employeeId);

      // Fetch employee data by ID from the API
      fetch(`http://127.0.0.1:5000/song?sid=${employeeId}`)
        .then(response => response.json())
        .then(employee => {
          namePut.value = employee.song_name;
          listenPut.value = employee.listen_count;
          ratePut.value = employee.rate;
          editFormContainer.style.display = 'block';
        });

      // Store the employeeId in the rememberedEmployeeId variable
      rememberedEmployeeId = employeeId;
    }

         // Delete data
         function deleteEmployee(song_id) {
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
          const row = document.querySelector(`#employee-list tr[data-eid="${song_id}"]`);
          row.parentNode.removeChild(row);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
        })
        .catch(error => console.error(error));
      }

      // Add an event listener to the employee list table
      const employeeList = document.getElementById('employee-list');
      employeeList.addEventListener('click', (event) => {
        const target = event.target;
        // Check if the clicked element is a delete button
        if (target.tagName === 'BUTTON' && target.textContent === 'Delete') {
          const song_id = target.getAttribute('data-eid');
          deleteEmployee(song_id);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
          const employeetable = document.getElementById('employee-table');
          employeetable.style.display = 'none';
          setTimeout(() => {
            successMessage.style.display = 'none';
            searchEmployee();
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

      const employeeData = {
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
        body: JSON.stringify(employeeData)
      })
        .then(response => response.json())
        .then(data => {
          const postFormContainer = document.getElementById('form-to-add');
          const employeetable = document.getElementById('employee-table');
          const postSuccessMessage = document.getElementById('success-message');
          postSuccessMessage.style.display = 'block';
          employeetable.style.display = 'none';
          postFormContainer.style.display = 'none';
          form.reset();
          console.log('Data Posted successfully:', data);
          setTimeout(()=>{
            // postFormContainer.style.display = 'none';
            postSuccessMessage.style.display = 'none';
            // // Refresh the employee list
            searchEmployee();
          },1000)
        })
        .catch(error => {console.error('Error posting data:', error);
                    const postFormContainer = document.getElementById('form-to-add');
                    // Display the error message to the user
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.textContent = 'Failed to POST Add exist Employee ID and Job ID, Please!!! ' +'(The main error: ' + error.message +')' ;
                    errorMessage.style.display = 'block';
                    postFormContainer.style.display = 'none';
                    const employeetable = document.getElementById('employee-table');
                    employeetable.style.display = 'none';
                    setTimeout(()=>{
                        postFormContainer.style.display = 'block';
                        errorMessage.style.display = 'none';
                        searchEmployee();
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
      const employeeId = form.getAttribute('data-employee-id');
      const song_name = document.getElementById('nameput').value;
      const listen_count = document.getElementById('listenput').value;
      const rate = document.getElementById('rateput').value;

      const employeeData = {
        song_id: employeeId,
        song_name: song_name,
        listen_count: listen_count,
        rate: rate
      };

      fetch(`http://127.0.0.1:5000/song`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      })
        .then(response => response.json())
        .then(data => {
          const editFormContainer = document.getElementById('edit-form-container');
          const employeetable = document.getElementById('employee-table');
          const putSuccessMessage = document.getElementById('put-success-message');
          putSuccessMessage.style.display = 'block';
          employeetable.style.display = 'none';
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
    function cancelFormedit() {
      const editForm = document.getElementById('form_to_put');
      editForm.style.display = 'none';
    }


    // Attach event listeners
    document.getElementById('show-form-to-add-employee').addEventListener('click', showAddForm);
    document.getElementById('form-to-add').addEventListener('submit', handleAddFormSubmit);
    document.getElementById('form_to_put').addEventListener('submit', handlePutFormSubmit);