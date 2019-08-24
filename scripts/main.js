// Limpiar el input cuando salgo del focus
const apiKey="f800b0f5b9ae24d9ff462e770da4d3b3"


fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
    .then(response => response.json())
    .then(res => {
        console.log(res.results[0]) 
        const popularNode = document.getElementById("popularList")
        const topFive = res.results.filter((e,i)=>i<5)
        topFive.forEach(({title,poster_path, id})=>{
            const a = document.createElement("a")
            a.classList.add("movieLink")
            a.href="#"
            const li = document.createElement("li")
            li.classList.add("movieBox")
            li.onclick = () =>toggleFunction(id)
            const image = document.createElement("img")
            image.src=`https://image.tmdb.org/t/p/w500/${poster_path}`
            image.classList.add("moviePoster")
            a.appendChild(image)
            const movieTitle = document.createElement("span")
            movieTitle.innerText=title
            movieTitle.classList.add("movieTitle")
            a.appendChild(movieTitle)
            li.appendChild(a)
            popularNode.appendChild(li)
        });
    })

const loadModal = (movieId) =>{
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
    .then(response => response.json())
    .then(res => {
        // console.log(`https://image.tmdb.org/t/p/w500${res.poster_path}`)
        const backgroundNode=document.getElementById("upperModal")
        // backgroundNode.style.backgroundImage = "url(`https://image.tmdb.org/t/p/w500${res.poster_path}`)";
        const mainTitleNode = document.getElementById("mainTitle")
        mainTitleNode.innerText = res.title
        const descriptionNode =document.getElementById("movieDescription")
        descriptionNode.innerText=res.overview
        const genreNode = document.getElementById("genre")
        genreNode.innerText=""
        const genreList = []
        res.genres.forEach(({name})=>genreList.push(name))
        genreNode.innerText= genreList.join(", ")
        const releaseDateNode = document.getElementById("releaseDate")
        releaseDateNode.innerText = res.release_date 
    })
}

const toggleFunction = (movieId) => {
    var modal = document.getElementById("modalContainer");
    if (modal.style.display === "none") {
        loadModal(movieId)
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}

const searchFunction = () => {
    let query = event.target.value
    if (query.length>=3 || (event.keyCode===13 && query!==lastRequest)) {
        lastRequest=query
        fetch (`https://api.themoviedb.org/3/search/movie?${apiKey}&query=${query}`)
            .then(res=>res.json())
            .then(res=>printResults(res.results))
    }
}

const printResults = (movies) => {
    const container = document.getElementById("results")
    container.innerHTML=""
    //ojo que de acá para adelante está repetido con la primera
    movies.forEach(({title,original_title,poster_path, id})=>{
        const a = document.createElement("a")
        a.classList.add("movieLink")
        a.href="#"
        const li = document.createElement("li")
        li.classList.add("movieBox")
        li.onclick = () =>toggleFunction(id)
        const image = document.createElement("img")
        image.src=`https://image.tmdb.org/t/p/w500/${poster_path}`
        image.classList.add("moviePoster")
        a.appendChild(image)
        const movieTitle = document.createElement("span")
        movieTitle.innerText===original_title? title : `${title} (${original_title})`//este pedacito es distinto
        movieTitle.classList.add("movieTitle")
        a.appendChild(movieTitle)
        li.appendChild(a)
        container.appendChild(li)
    })
}

const selectCategory = (category) => {
    fetch (`https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}`)
        .then(res=>res.json())
        .then(res=>printCategory(res.results))
}

const printCategory = (movies) => {
    let container = document.getElementById("categoryResults")
    container.innerHTML=""
    //ojo que de acá para adelante está repetido con la primera
    movies.forEach(({title,poster_path, id})=>{
        const a = document.createElement("a")
        a.classList.add("movieLink")
        a.href="#"
        const li = document.createElement("li")
        li.classList.add("movieBox")
        li.onclick = () =>toggleFunction(id)
        const image = document.createElement("img")
        image.src=`https://image.tmdb.org/t/p/w500/${poster_path}`
        image.classList.add("moviePoster")
        a.appendChild(image)
        const movieTitle = document.createElement("span")
        movieTitle.innerText=title
        movieTitle.classList.add("movieTitle")
        a.appendChild(movieTitle)
        li.appendChild(a)
        container.appendChild(li)
    });
}
