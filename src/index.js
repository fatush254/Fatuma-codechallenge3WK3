// Your code here


let filmEndpoint = "http://localhost:4000/films";

document.addEventListener("DOMContentLoaded", () => {
    getMovies();
    document.querySelector("#buy-ticket").addEventListener("click", handleBuyTicket);
});

function getMovies() {
    fetch(filmEndpoint)
        .then(res => res.json())
        .then(movies => {
            movies.forEach(movie => {
                renderMovieList(movie);
            });
            const firstMovie = document.querySelector("#id1");
            firstMovie.dispatchEvent(new Event("click"));
        });
}



function renderMovieList(movie) {
    const li = document.createElement("li");
    li.textContent = `${movie.title}`;
    li.id = "id" + movie.id;
    const ul = document.querySelector("#films");
    ul.appendChild(li);
    li.classList.add("film");
    li.classList.add("item");

    // Add delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        removeFilm(movie.id);
    });
    li.appendChild(deleteButton);

    li.addEventListener("click", () => {
        handleMovieClick(movie);
    });


}


function handleMovieClick(movie) {
    const poster = document.querySelector("img#poster");
    poster.src = movie.poster;
    poster.alt = movie.title;
    const info = document.querySelector("#showing");
    info.querySelector("#title").textContent = movie.title;
    info.querySelector("#runtime").textContent = movie.runtime + " minutes";
    info.querySelector("#film-info").textContent = movie.description;
    info.querySelector("#showtime").textContent = movie.showtime;
    info.querySelector("#ticket-num").textContent =
        movie.capacity - movie.tickets_sold + " remaining tickets";
}


function handleBuyTicket(Ticket) {
    const ticketDiv = document.querySelector("#ticket-num");
    const tickets = ticketDiv.textContent.split(" ")[0];
    if (tickets > 0) {
        ticketDiv.textContent = tickets - 1 + " remaining tickets";
    }
    
}


function removeFilm(filmId) {
    // Remove film from the list (client-side)
    const filmElement = document.querySelector(`#id${filmId}`);
    filmElement.remove();

    // Delete film on the server
    fetch(`${filmEndpoint}/${filmId}`, {
        method: "DELETE",
    })
        .then(res => res.json())
        .then(data => {
            console.log(`Film with ID ${filmId} deleted on the server.`);
        })
        .catch(error => {
            console.error(`Error deleting film with ID ${filmId}: ${error.message}`);
        });
}
