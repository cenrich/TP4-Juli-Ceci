const apiKey="f800b0f5b9ae24d9ff462e770da4d3b3"
let currentPage=2

const clearAll = () => {
    document.getElementById("mainContainer").style.display="none"
    document.getElementById("results").parentNode.style.display="none"
    document.getElementById("categoryResults").parentNode.style.display="none"
}

const homePage = () => {
    clearAll()
    document.getElementById("mainContainer").style.display="block"
    populateCatHome("popular")
    populateCatHome("top_rated")
    populateCatHome("upcoming")
    populateCatHome("now_playing")
}

const populateCatHome = (category) => {
    const container = document.getElementById(category)
    container.innerHTML=""
    fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}`)
        .then(response => response.json())
        .then(res => populateList(res.results.filter((e,i)=>i<5),container))
}

const populateList = (arrayOfMovies,container) =>{
    arrayOfMovies.forEach(({title,poster_path, id})=>{
        const li = document.createElement("li")
        li.classList.add("movieBox")
        const a = document.createElement("a")
        a.classList.add("movieLink")
        a.href="#"
        a.onclick = () =>toggleFunction(id)
        const image = document.createElement("img")
        image.src=`https://image.tmdb.org/t/p/w500/${poster_path}` //acá si no existe poster_path, a veces se saltea directamente la película
        image.classList.add("moviePoster")
        const movieTitle = document.createElement("span")
        movieTitle.innerText=title //acá para el caso de búsqueda me gustaría hacer como en clase
        movieTitle.classList.add("movieTitle")
        a.appendChild(image)
        a.appendChild(movieTitle)
        li.appendChild(a)
        container.appendChild(li)
    })
}    

const loadModal = (movieId) =>{
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
    .then(response => response.json())
    .then(res => {
        console.log(`https://image.tmdb.org/t/p/w500${res.poster_path}`)
        // const backgroundNode=document.getElementById("upperModal")
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
    clearAll()
    const container = document.getElementById("results")
    container.innerHTML=""
    container.parentNode.style.display="block"
    populateList(movies,container)
}

const selectCategory = (category) => {
    fetch (`https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}`)
        .then(res=>res.json())
        .then(res=>printCategory(res.results,category,res.total_results))
}

const printCategory = (movies,category,totalResults) => {
    clearAll()
    let container = document.getElementById("categoryResults")
    container.parentNode.style.display="block"
    container.innerHTML=""
    console.log(setCatTitle(category,totalResults)) //corté acá, estoy tratando de agregar título dinámicamente
    container.parentNode.appendChild(setCatTitle(category,totalResults))
    populateList(movies,container)
    setButton(container,category)
}

const setCatTitle = (category,totalResults) => {
    const header = document.createElement("div")
    const title = document.createElement("h3")
    switch (category) {
        case "popular":
            title.innerText="Más vistas";
        break;
        case "top_rated":
            title.innerText="Mejor puntuadas";
        break;
        case "upcoming":
            title.innerText="Pronto"
        break;
        case "now_playing":
            title.innerText="En cartel"
    }
    const categoryCount = document.createElement("a")
    categoryCount.innerText=`${totalResults} resultados`
    header.appendChild(title)
    header.appendChild(categoryCount)
    return header
}

const setButton = (container,category) => {
    const loadMoreNode = document.createElement("button")
    loadMoreNode.innerText="Más resultados"
    loadMoreNode.onclick=()=>loadMore(category)
    container.parentNode.appendChild(loadMoreNode)
}

const loadMore = (category) => {
    const container = document.getElementById("categoryResults")
    fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&page=${currentPage}`)
    // fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${currentPage}`)
        .then(response => response.json())
        .then(res => populateList(res.results,container))
    currentPage++
}