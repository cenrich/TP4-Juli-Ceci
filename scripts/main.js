// Limpiar el input cuando salgo del focus
fetch("https://api.themoviedb.org/3/movie/550?api_key=f800b0f5b9ae24d9ff462e770da4d3b3")
    .then(response => response.json())
    .then(res => {
        console.log(res);
        // const {data} = res
        // data.map(({id, name}) => console.log(`id: ${id}\nname: ${name}`))
    })
