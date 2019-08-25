// Limpiar el input cuando salgo del focus
const apiKey="f800b0f5b9ae24d9ff462e770da4d3b3"


fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
    .then(response => response.json())
    .then(res => {
        console.log(res.results[0]) 
        const popularNode = document.getElementById("popularList")
        const topFive = res.results.filter((e,i)=>i<5)
        topFive.forEach(({title,poster_path})=>{
            const li = document.createElement("li")
            li.classList.add("movieBox")
            const image = document.createElement("img")
            image.src=`https://image.tmdb.org/t/p/w500/${poster_path}`
            image.classList.add("moviePoster")
            li.appendChild(image)
            const movieTitle = document.createElement("span")
            movieTitle.innerText=title
            movieTitle.classList.add("movieTitle")
            li.appendChild(movieTitle)
            popularNode.appendChild(li)
        });
    })