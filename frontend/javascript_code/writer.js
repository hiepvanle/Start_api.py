//search album id, name
const list = document.getElementById('list');
const search = document.getElementById('search');
const listItem = [];

search.addEventListener('input', (e) => filterInput(e.target.value))

fetchAlbums();

async function fetchAlbums() {
    const response = await fetch('http://127.0.0.1:5000/writer?wid=*');
    const data = await response.json();
    console.log(':>>>> data', data);
    list.innerHTML = 'Loading....';
    setTimeout(() => {
        list.innerHTML = '';
        data.forEach(data => {
            const divItem = document.createElement('div');
            divItem.innerHTML = `
                <div class="detail">
                    <h2>${data.write_id}</h2>
                    <p>Name: ${data.writer_name} <br/>
                    Description: ${data.writer_description}</p>
                </div>
            `;
            list.appendChild(divItem);
        });
    }, 2000);
}
