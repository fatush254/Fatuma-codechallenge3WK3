// Define the URL for the GET request
const filmsURL = 'http://localhost:3000/films';

// Get references to DOM elements
const title = document.getElementById('title');
const runtime = document.getElementById('runtime');
const filmInfo = document.getElementById('film-info');
const showtime = document.getElementById('showtime');
const ticketNum = document.getElementById('ticket-num');
const buyTicket = document.getElementById('buy-ticket');
const poster = document.getElementById('poster');
const filmsList = document.getElementById('films');
const deleteButton = document.getElementById('delete-button');

// Function to update movie details
function updateMovieDetails(movie) {
  title.textContent = movie.title;
  runtime.textContent = movie.runtime;
  filmInfo.textContent = movie.description;
  showtime.textContent = movie.showtime;
  poster.src = movie.poster;
}

// Function to update ticket availability
function updateTicketAvailability(remainingTickets) {
  if (remainingTickets === 0) {
    buyTicket.textContent = 'Sold out!';
    buyTicket.disabled = true;
  } else {
    buyTicket.textContent = 'Buy ticket';
    buyTicket.disabled = false;
  }
  ticketNum.textContent = remainingTickets;
}

// Function to handle buying tickets
function buyTicketHandler(movie) {
  return () => {
    const remainingTickets = movie.capacity - movie.tickets_sold;
    if (remainingTickets > 0) {
      movie.tickets_sold++;
      updateTicketAvailability(remainingTickets - 1);

      // Update tickets_sold on the server
      fetch(`${filmsURL}/${movie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tickets_sold: movie.tickets_sold
        })
      });
    }
  };
}

// Function to create movie list item
function createMovieListItem(movie) {
  const li = document.createElement('li');
  li.textContent = movie.title;
  li.classList.add('film', 'item');

  if (movie.tickets_sold === movie.capacity) {
    li.classList.add('sold-out');
  }

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('ui', 'button', 'delete-button');

  deleteButton.addEventListener('click', () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      fetch(`${filmsURL}/${movie.id}`, {
        method: 'DELETE'
      })
      .then(() => {
        li.remove();
      });
    }
  });

  li.appendChild(deleteButton);
  return li;
}

// On window load, fetch movie data and manipulate DOM
window.onload = () => {
  // Fetch movie data
  fetch(filmsURL)
    .then(response => response.json())
    .then(data => {
      // Display details for the first movie
      const firstMovie = data[0];
      updateMovieDetails(firstMovie);
      updateTicketAvailability(firstMovie.capacity - firstMovie.tickets_sold);

      // Event listener for buying tickets
      buyTicket.addEventListener('click', buyTicketHandler(firstMovie));

      // Populate movie menu
      data.forEach(movie => {
        const li = createMovieListItem(movie);
        filmsList.appendChild(li);
        li.addEventListener('click', () => {
          updateMovieDetails(movie);
          updateTicketAvailability(movie.capacity - movie.tickets_sold);
          buyTicket.addEventListener('click', buyTicketHandler(movie));
        });
      });
    });
};