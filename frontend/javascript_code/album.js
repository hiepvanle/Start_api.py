
getDatafromAlbumAPI();

async function getDatafromAlbumAPI() {
    try {
        const responseAPI = await fetch('http://127.0.0.1:5000/album?aid=*');
        const data = await responseAPI.json();
        console.log('data :>>', data);
    } catch (error) {
        console.error('An error occurred while fetching data from the album API: ', error);
    }
}