let rememberedWriterId = ""; // Variable to store the remembered writer ID

    function searchWriter() {
      const search = document.getElementById('searchid').value;
      const writertable = document.getElementById('writer-table');

      if (search === '*') {
        // Fetch all writers from the API
        fetch('http://127.0.0.1:5000/writer?wid=*')
          .then(response => response.json())
          .then(data => {
            writertable.style.display = 'block';
            const writerList = document.getElementById('writer-list');
            writerList.innerHTML = ''; // Clear all data table before adding new data

            data.forEach(writer => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${writer.writer_id}</td>
                <td>${writer.writer_name}</td>
                <td>${writer.writer_description}</td>
                <td>

                <td>
                  <button onclick="showEditForm('${writer.writer_id}')">Edit</button>
                  <button data-wid="${writer.writer_id}">Delete</button></td>
                </td>
              `;
              writerList.appendChild(tr);
            });
          });
      } else {
        // Fetch writer by ID from the API
        fetch(`http://127.0.0.1:5000/writer?wid=${search}`)
          .then(response => response.json())
          .then(writer => {
            writertable.style.display = 'block';
            const writerList = document.getElementById('writer-list');
            writerList.innerHTML = ''; // Clear all data table before adding new data

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${writer.writer_id}</td>
              <td>${writer.writer_name}</td>
              <td>${writer.writer_description}</td>

              <td>
                <button onclick="showEditForm('${writer.writer_id}')">Edit</button>
                <button onclick="deleteWriter('${writer.writer_id}')">Delete</button>
              </td>
            `;
            writerList.appendChild(tr);
          })
          .catch(error => {
            writertable.style.display = 'none';
            console.log('Song not found:', error);
          });
      }
    }

    function showAddForm() {
      const addForm = document.getElementById('form-to-add');
      addForm.style.display = 'block';
    }

    function showEditForm(writerId) {
      const editFormContainer = document.getElementById('edit-form-container');
      const formToPut = document.getElementById('form_to_put');

      const namePut = document.getElementById('nameput');
      const descriptionPut = document.getElementById('descriptionput');


      // Set the Writer ID in the edit form
      formToPut.setAttribute('data-writer-id', writerId);

      // Fetch Writer data by ID from the API
      fetch(`http://127.0.0.1:5000/writer?wid=${writerId}`)
        .then(response => response.json())
        .then(writer => {
          namePut.value = writer.writer_id;
          descriptionPut.value = writer.writer_description;
          editFormContainer.style.display = 'block';
        });

      // Store the writerId in the rememberedWriterId variable
      rememberedWriterId = writerId;
    }

         // Delete data
         function deleteWriter(writer_id) {
        // Send a DELETE request to the API with the wid value
        fetch(`http://127.0.0.1:5000/writer`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({writer_id: writer_id})
        })
        .then(response => {
          // If the request is successful, remove the corresponding table row
          const row = document.querySelector(`#writer-list tr[data-wid="${writer_id}"]`);
          row.parentNode.removeChild(row);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
        })
        .catch(error => console.error(error));
      }

      // Add an event listener to the writer list table
      const writerList = document.getElementById('writer-list');
      writerList.addEventListener('click', (event) => {
        const target = event.target;
        // Check if the clicked element is a delete button
        if (target.tagName === 'BUTTON' && target.textContent === 'Delete') {
          const writer_id = target.getAttribute('data-wid');
          deleteWriter(writer_id);
          const successMessage = document.getElementById('delete-success-message');
          successMessage.style.display = 'block';
          const writertable = document.getElementById('writer-table');
          writertable.style.display = 'none';
          setTimeout(() => {
            successMessage.style.display = 'none';
            searchWriter();
          }, 2000);
        }
      });
    function handleAddFormSubmit(event) {
      event.preventDefault();

      const form = document.getElementById('form-to-add');
      const writer_id = document.getElementById('writer_id').value;
      const writer_name = document.getElementById('writer_name').value;
      const writer_description = document.getElementById('writer_description').value;


      const writerData = {
        writer_id: writer_id,
        writer_name: writer_name,
        writer_description: writer_description

      };

      fetch('http://127.0.0.1:5000/writer?wid=*', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(writerData)
      })
        .then(response => response.json())
        .then(data => {
          const postFormContainer = document.getElementById('form-to-add');
          const writertable = document.getElementById('writer-table');
          const postSuccessMessage = document.getElementById('success-message');
          postSuccessMessage.style.display = 'block';
          writertable.style.display = 'none';
          postFormContainer.style.display = 'none';
          form.reset();
          console.log('Data Posted successfully:', data);
          setTimeout(()=>{
            // postFormContainer.style.display = 'none';
            postSuccessMessage.style.display = 'none';
            // // Refresh the writer list
            searchWriter();
          },1000)
        })
        .catch(error => {console.error('Error posting data:', error);
                    const postFormContainer = document.getElementById('form-to-add');
                    // Display the error message to the user
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.textContent = 'Failed to POST Add exist writer ID, Please!!! ' +'(The main error: ' + error.message +')' ;
                    errorMessage.style.display = 'block';
                    postFormContainer.style.display = 'none';
                    const writertable = document.getElementById('writer-table');
                    writertable.style.display = 'none';
                    setTimeout(()=>{
                        postFormContainer.style.display = 'block';
                        errorMessage.style.display = 'none';
                        searchWriter();
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
      const writerId = form.getAttribute('data-writer-id');
      const writer_name = document.getElementById('nameput').value;
      const writer_description = document.getElementById('descriptionput').value;


      const writerData = {
        writer_id: writerId,
        writer_name: writer_name,
        writer_description: writer_description

      };

      fetch(`http://127.0.0.1:5000/writer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(writerData)
      })
        .then(response => response.json())
        .then(data => {
          const editFormContainer = document.getElementById('edit-form-container');
          const writertable = document.getElementById('writer-table');
          const putSuccessMessage = document.getElementById('put-success-message');
          putSuccessMessage.style.display = 'block';
          writertable.style.display = 'none';
          editFormContainer.style.display = 'none';
          form.reset();
          console.log('Data updated successfully:', data);
          setTimeout(()=>{
            editFormContainer.style.display = 'none';
            putSuccessMessage.style.display = 'none';
            // Refresh the writer list
            searchWriter();
          },1000)

        })
        .catch(error => console.error('Error updating data:', error));
    }
    function cancelFormedit() {
      const editForm = document.getElementById('form_to_put');
      editForm.style.display = 'none';
    }


    // Attach event listeners
    document.getElementById('show-form-to-add-writer').addEventListener('click', showAddForm);
    document.getElementById('form-to-add').addEventListener('submit', handleAddFormSubmit);
    document.getElementById('form_to_put').addEventListener('submit', handlePutFormSubmit);