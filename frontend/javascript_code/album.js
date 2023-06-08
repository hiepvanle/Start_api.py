async function logJSONData() {
    const response = await fetch("http://127.0.0.1:5000/album?aid=*");
    const jsonData = await response.json();
    console.log(jsonData);
  }

