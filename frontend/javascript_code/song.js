//search album id, name
const list = document.getElementById('list');
const search = document.getElementById('search');
const listItem = [];

fetchAlbums();

async function fetchAlbums() {
    const response = await fetch('http://127.0.0.1:5000/song?songid=*');
    const data = await response.json();
    console.log(':>>> data,', data)
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

