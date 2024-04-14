// Define the URL for the GET request
const myGetRequest = new Request('http://localhost:4000/films');

// Get references to DOM elements
const title = document.getElementById('title');
const runtime = document.getElementById('runtime');
const filmInfo = document.getElementById('film-info');
const showtime = document.getElementById('showtime');
const ticketNum = document.getElementById('ticket-num');
const buyTicket = document.getElementById('buy-ticket');
const poster = document.getElementById('poster');
const films = document.getElementById('films');
const deleteButton = document.getElementById('delete-button');




// On window load, fetch movie data and manipulate DOM
window.onload = () => {

    fetch(myGetRequest)
        .then((response) => response.json())

        .then((data) => {
            const firstMovie = data[0];
            let remainingTickets = firstMovie.capacity - firstMovie.tickets_sold;

			if (remainingTickets === 0) {
                buyTicket.innerHTML = `Sold out!`;
            } else {
                buyTicket.innerHTML = `Buy ticket`;
            }

            title.innerHTML = `${firstMovie.title}`;
            runtime.innerHTML = `${firstMovie.runtime}`;
            filmInfo.innerHTML = `${firstMovie.description}`;
            showtime.innerHTML = `${firstMovie.showtime}`;
            ticketNum.innerHTML = `${remainingTickets}`;
            buyTicket.innerHTML = 'Buy ticket';
            poster.src = `${firstMovie.poster}`;

            buyTicket.addEventListener('click', () => {
                if (remainingTickets > 0) {
                    remainingTickets--;
                    ticketNum.innerHTML = `${remainingTickets}`;
                } else if (remainingTickets === 0) {
                    ticketNum.innerHTML = `${remainingTickets}`;
                    buyTicket.innerHTML = `Sold out!`;
                }
            });

            films.innerHTML = '';
            data.forEach((movie, index) => {
                const li = document.createElement('li');
                li.innerHTML = <b>${movie.title}</b>;
                films.appendChild(li);

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = 'Delete';
                deleteButton.classList.add('ui', 'button');
                deleteButton.style.marginLeft = '5px';
                li.appendChild(deleteButton);

                li.addEventListener('mouseover', () => {
                    li.style.color = 'white';
                    li.style.cursor = 'pointer';
                });

                li.addEventListener('mouseout', () => {
                    li.style.color = 'black';
                });

                deleteButton.addEventListener('click', () => {
                    if (window.confirm('Are you sure you want to delete this movie?')) {
                        data.splice(index, 1);
                        films.removeChild(li);
                    }
                });

                li.addEventListener('click', () => {
                    remainingTickets = movie.capacity - movie.tickets_sold;
                    title.innerHTML = `${movie.title}`;
                    runtime.innerHTML = `${movie.runtime}`;
                    filmInfo.innerHTML = `${movie.description}`;
                    showtime.innerHTML = `${movie.showtime}`;
                    ticketNum.innerHTML = `${remainingTickets}`;
                    buyTicket.innerHTML = 'Buy ticket';
                    poster.src = `${movie.poster}`;
                });
            });
        });
};


