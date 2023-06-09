searchAlbum();
async function searchAlbum() {
    const results = await fetch(`http://127.0.0.1:5000/album?aid=*`, {mode: 'no-cors'});
    const data = await results.json();
    const album = data.albums.items[0];
    return {
    title: album.name,
    artist: album.artists[0].name,
    coverArtUrl: album.images[0].url,
};
}