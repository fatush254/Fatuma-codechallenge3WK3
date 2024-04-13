// start a new GET request to get the server running on the backend
const myGetRequest = new Request('http://localhost:4000/films');
// Get all IDs in the HTML for DOM manipulation
const title = document.getElementById('title');
const runtime = document.getElementById('runtime');
const filmInfo = document.getElementById('film-info');
const showtime = document.getElementById('showtime');
const ticketNum = document.getElementById('ticket-num');
const buyTicket = document.getElementById('buy-ticket');
const poster = document.getElementById('poster');
const films = document.getElementById('films');
const subtitle = document.getElementById('subtitle');
const showing = document.getElementById('showing');
const body = document.getElementsByTagName('body')[0]; // Get the first body element

//start function
// On full load, the first movie should be displayed as default
window.onload = () => {
	// fetch details from the server
	fetch(myGetRequest)
		//JSONIFY the response
		.then((response) => response.json())
		//.then to handle async and promise from the server
		.then((data) => {
			// first movie should start from the first data in the array
			const firstMovie = data[0];
			// get the number of remaining tickets to sell from subtracting capacity - tickets_sold
			let remainingTickets = firstMovie.capacity - firstMovie.tickets_sold;
			// manipulate the HTML from the JavaScript side by targeting the IDs

			title.innerHTML = `${firstMovie.title}`;
			runtime.innerHTML = `${firstMovie.runtime}`;
			filmInfo.innerHTML = `${firstMovie.description}`;
			showtime.innerHTML = `${firstMovie.showtime}`;
			ticketNum.innerHTML = `${remainingTickets}`;
			buyTicket.innerHTML = 'Buy ticket';
			poster.src = `${firstMovie.poster};`
			// eventlistener for clicking the buy ticket button
			buyTicket.addEventListener('click', () => {
				// check if the remaining tickets are more than 0, then start subtracting
				if (remainingTickets > 0) {
					// -- to deduct
					remainingTickets--;
					// display dynamically on the html
					ticketNum.innerHTML = `${remainingTickets}`;
				} else if (remainingTickets === 0) {
					// once tickets remaining are 0, show a sold out on the button and disable buying more tickets
					ticketNum.innerHTML = `${remainingTickets}`;
					buyTicket.innerHTML = `Sold out!`;
				}
			});
			// remove the first movie so as to proceed adding the rest
			films.innerHTML = '';
			// forEach to add the movies one by  one, just like a for loop
			data.forEach((movie, index) => {
				// create a list to display all the movies
				const li = document.createElement('li');
				// dynamically show the movie titles
				li.innerHTML = <b>${movie.title}</b>;
				// append the new list to the films ID on the HTML
				films.appendChild(li);
				// add a button to delete each movie
				const deleteButton = document.createElement('button');
				deleteButton.innerHTML = 'Delete';
				// add class using JS
				deleteButton.classList.add('ui', 'button');
				// add space/style using css but on JS
				deleteButton.style.marginLeft = '5px';
				// append the new button on the HTML
				li.appendChild(deleteButton);
				// add cursor/color when one hovers over a movie, will use eventlistener for mouseover
				li.addEventListener('mouseover', () => {
					li.style.color = 'red';
					li.style.cursor = 'pointer';
				});
				// when one isn't hovering the movie name, return to default color
				li.addEventListener('mouseout', () => {
					li.style.color = 'black';
				});
				// delete button for each movie
				//only delete when user confirms/selects okay
				deleteButton.addEventListener('click', () => {
					// alert for user to confirm
					if (window.confirm('Are you sure you want to delete this movie?')) {
						// perform the deletion
						data.splice(index, 1);
						// Update the list and remove the movie
						films.removeChild(li);
					}
				});
				// when a user selects a certain movie, update the rest of the data e.g description accordingly and dynamically
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
    



