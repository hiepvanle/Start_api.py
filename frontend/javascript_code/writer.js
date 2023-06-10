//search album id, name
const list = document.getElementById('list');
const search = document.getElementById('search');
const listItem = [];

search.addEventListener('input', (e) => filterInput(e.target.value))

fetchAlbums();

async function fetchAlbums() {
    const response = await fetch('http://127.0.0.1:5000/writer?wid=*');
    const data = await response.json();
    list.innerHTML = 'Loading....';
    setTimeout(() => {
        list.innerHTML = '';
        data.forEach(data => {
            const divItem = document.createElement('div');
            listItems.push(divItem);
            divItem.innerHTML = `
                <div class="detail">
                    <h2>${data.album_id}</h2>
                    <p>${data.album_name} .${data.album_description} .${data.album_date}</p>
                </div>
            `;
            list.appendChild(divItem);
        });
    }, 2000);
}

function filterInput(keySearch) {
    const searchTerm = keySearch.toLowerCase();
    console.log(':>>>> searchTerm', searchTerm);
    listItems.forEach((item) => {
        if(item.innerText.toLowerCase().includes(searchTerm)) {
            item.classList.remove('hidden');
        } 
        else {
            item.classList.add('hidden');
        }
    })
  }