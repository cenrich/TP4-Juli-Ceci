const apiKey="f800b0f5b9ae24d9ff462e770da4d3b3"

const clearAll = () => {
    document.getElementById("mainContainer").style.display="none"
    document.getElementById("resultsContainer").style.display="none"
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
    fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}`) //(1) hago 2 fetch a esta url, la función se diferencia en las dos líneas orevuas y qué hago con el resultado
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
        a.classList.add("movieTitle")
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
            // console.log(`https://image.tmdb.org/t/p/w500${res.poster_path}`) //acá tengo el problema del background
            // const backgroundNode=document.getElementById("upperModal")
            // backgroundNode.style.backgroundImage = "url(`https://image.tmdb.org/t/p/w500${res.poster_path}`)";
            const mainTitleNode = document.getElementById("mainTitle")
            mainTitleNode.innerText = res.title
            const descriptionNode =document.getElementById("movieDescription")
            descriptionNode.innerText=res.overview
            const genreNode = document.getElementById("genre")
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
            .then(res=>printResults(res.results,query,res.total_results))
    }
}

const printResults = (movies,query,totalResults) => {
    clearAll()
    
    const resultsContainer = document.getElementById("resultsContainer")
    resultsContainer.innerHTML=""
    resultsContainer.style.display="block"
    resultsContainer.appendChild(setCatTitle(query,totalResults))
    
    const results = document.createElement("ul")
    results.classList.add("movieList")
    results.id="results"
    populateList(movies,results)
    resultsContainer.appendChild(results)
    
    setButton(results,query)
}

const selectCategory = (category) => {
    fetch (`https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}`) //ver (1)
        .then(res=>res.json())
        .then(res=>printResults(res.results,category,res.total_results))
}

const setCatTitle = (category,totalResults) => {
    const header = document.createElement("div")
    header.classList.add("catHeader")
    const title = document.createElement("h3")
    title.classList.add("catTitle")
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
        break;
        default: 
            title.innerText="Resultados"
    }
    const categoryCount = document.createElement("a")
    categoryCount.innerText=`${totalResults} resultados`
    categoryCount.classList.add("catCount")
    header.appendChild(title)
    header.appendChild(categoryCount)
    return header
}

const setButton = (container,category) => {
    let currentPage = 2
    const loadMoreNode = document.createElement("button")
    loadMoreNode.innerText="Más resultados"
    loadMoreNode.onclick=()=>{
        loadMore(category,currentPage)
        currentPage++
        return currentPage
    }
    container.parentNode.appendChild(loadMoreNode)
}

const loadMore = (query,currentPage) => {
    const container = document.getElementById("results")
    let url
    query === "popular"||query==="top_rated"||query==="upcoming"||query==="now_playing"
        ?url=`https://api.themoviedb.org/3/movie/${query}?api_key=${apiKey}&page=${currentPage}`
        :url=`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${currentPage}`

    fetch(url)
        .then(response => response.json())
        .then(res => populateList(res.results,container))
}