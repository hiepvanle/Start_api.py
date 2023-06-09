getDataFromAlbumAPI();

async function getDataFromAlbumAPI() {
    const responseAPI = await fetch('http://127.0.0.1:5000/album?aid=*' {mode: 'no-cors'});
    const data = await responseAPI.json();
    console.log(':>>>> data', data);
}