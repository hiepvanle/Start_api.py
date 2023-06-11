//search album id, name
const list = document.getElementById('list');
const search = document.getElementById('search');
const listItem = [];

search.addEventListener('input', (e) => filterInput(e.target.value))

fetchAlbums();

async function fetchAlbums() {
    const response = await fetch('http://127.0.0.1:5000/singer?sid=*');
    const data = await response.json();
    console.log(':>>>> data', data);
    list.innerHTML = 'Loading....';
    setTimeout(() => {
        list.innerHTML = '';
        data.forEach(data => {
            const divItem = document.createElement('div');
            divItem.innerHTML = `
                <div class="detail">
                    <h2>${data.singer_id}</h2>
                    <p>Name: ${data.singer_name} <br/>
                    Description: ${data.singer_description} <br/>
                    Hometown: ${data.hometown} <br/>
                    Date of birth: ${data.date_of_birth}</p>
                </div>
            `;
            list.appendChild(divItem);
        });
    }, 2000);
}

