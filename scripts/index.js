class Gif {
	constructor() {
		this.APIKEY = "gQI6Rlg7k278ElyIYGIW7pRogbFniBkT"
		this.URLBASE = 'https://api.giphy.com/v1/gifs'
	}
	async autocompleteSearch(search) {
		const data = await fetch(`${this.URLBASE}/search/tags?api_key=${this.APIKEY}&q=${search}`);
		return await data.json();
	}
	async getGifs(search, limit) {
		const data = await fetch(`${this.URLBASE}/search?api_key=${this.APIKEY}&q=${search}&limit=${limit}&rating=G`);
		return await data.json();
	}
	async trendingGifs(limit) {
		const data = await fetch(`${this.URLBASE}/trending?api_key=${this.APIKEY}&limit=${limit}&rating=G`);
		return await data.json();
	}
	async getMyGifs(gifs) {
		const data = await fetch(`${this.URLBASE}?ids=${gifs}&api_key=${this.APIKEY}`);
		return await data.json();
	}
}

var activeTheme

 function checkActiveTheme(theme) {

	if(theme == null){
		localStorage.setItem('themeActive', 'day-theme')

		activeTheme = 'day-theme'
	}
	else if(theme == "night-theme")   {

		changeThemeNight()
	}

}

const nightThemeButton = document.getElementById('night-theme')
const dayThemeButton = document.getElementById('day-theme')

function changeThemeNight() {
	document.getElementById('logoGifo').src ='assests/img/gifOF_logo_dark.png'
	document.getElementById('fotoLupa').src ='assests/img/lupa_inactive_dark.svg'

	document.getElementById('sheetStyle').href = "assests/styles/themeNight.css"
	nightThemeButton.classList = 'theme-active'
	dayThemeButton.classList = ''
	localStorage.setItem('themeActive','night-theme')
	
	nightThemeButton.removeEventListener('click',changeThemeNight)

	dayThemeButton.addEventListener('click',changeThemeDay)
	dropdownOptions.classList = 'hidden dropdown-options'
}

function changeThemeDay() {

	document.getElementById('sheetStyle').href = "assests/styles/themeDay.css"
	localStorage.setItem('themeActive', 'day-theme')
	
	document.getElementById('logoGifo').src ='assests/img/gifOF_logo.png'
	document.getElementById('fotoLupa').src ='assests/img/lupa_inactive.svg'

	nightThemeButton.classList = ''
	dayThemeButton.classList = 'theme-active'

	dayThemeButton.removeEventListener('click',changeThemeDay )

	nightThemeButton.addEventListener('click',changeThemeNight)
	dropdownOptions.classList = 'hidden dropdown-options'
	
}



const renderSuggestionGallery = async () => {
	const suggestionsGallery = document.getElementById('suggestions-gallery')
	const topics = ['Dog', 'Snoopy', 'What', 'Hello']
	const gif = new Gif();

	for (let i = 0; i < topics.length; i++) {
		const data = await gif.getGifs(topics[i], 1)
		const div = document.createElement('div')
		div.className = 'suggestions-gallery-item'
		div.innerHTML = `
		  <div class="topic-tittle fondo-degrade">
			#${topics[i]}
			<img src="./assests/img/button_close.svg" alt="close button">
		  </div>
		  <img class="suggestion-image" src ="${data.data[0].images.downsized.url}" alt="${data.data[0].tittle}" >
		  <button type="button" data-topic="${topics[i]}">Ver más...</button>
		`;
		suggestionsGallery.appendChild(div);
	}

}


const renderTrendingGallery = async () => {
	const trendingGallery = document.getElementById('trending-gallery')
	const gif = new Gif();
	const data = await gif.trendingGifs(14)

	data.data.forEach(element => {
		const div = document.createElement('div')
		const trendTitle = document.createElement('p')
		div.className = 'trending-gallery-item'
		div.style.background = `url(${element.images.fixed_height.url}) no-repeat center`;
		div.style.backgroundSize = 'cover'
		trendTitle.innerHTML = `${formatTitleTrending(element.title)}`
		trendTitle.className = 'trending-gallery-item-title fondo-degrade'
		div.appendChild(trendTitle)
		trendingGallery.appendChild(div)
	});

}



// completar
const myGifsGallery = document.getElementById('mygifs-gallery')
const sugestionsSection = document.getElementById('sugestions')
const trendingSection = document.getElementById('trending')
const myGifsSection = document.getElementById('myGifs')

const renderMyGifsGallery = async () => {
	let misGifosSubidos = localStorage.getItem('misGifos')

	sugestions.classList.add('hidden')
	trending.classList.add('hidden')
	myGifsSection.classList.remove('hidden')
	myGifsGallery.innerHTML = ''
	console.log(localStorage.getItem('misGifos'))
	if (misGifosSubidos != null){
		
		const gif = new Gif();
		const data = await gif.getMyGifs(misGifosSubidos)
		console.log(data)
		data.data.forEach(element => {
			const div = document.createElement('div');
			div.className = 'trending-gallery-item';
			div.style.background = `url(${element.images.fixed_height.url}) no-repeat center`;
			div.style.backgroundSize = 'cover';
			myGifsGallery.appendChild(div);
		});
	}
}

const renderResultsGallery = async (resultsGallery, search, limit) => {
	const gif = new Gif();
	const data = await gif.getGifs(search, limit);

	resultsGallery.previousElementSibling.textContent = `${search} [resultados]`;
	resultsGallery.parentElement.style.display = 'block';
	resultsGallery.innerHTML = '';

	data.data.forEach(element => {
		const div = document.createElement('div');
		div.className = 'result-gallery-item';
		div.style.background = `url(${element.images.fixed_height.url}) no-repeat center`;
		div.style.backgroundSize = 'cover';
		resultsGallery.appendChild(div);
	});
	resultsGallery.parentElement.scrollIntoView();
	renderHistory(searchInput.value)
}
const dropdown = document.querySelector('.dropdown');
const dropdownOptions = document.querySelector('.dropdown-options');


document.addEventListener('DOMContentLoaded', e => {
	renderSuggestionGallery()
	renderTrendingGallery()

	checkActiveTheme(localStorage.getItem('themeActive'))
	console.log(localStorage.getItem('themeActive'))


	nightThemeButton.addEventListener('click', changeThemeNight)

	document.getElementById('myGifosButton').addEventListener('click', renderMyGifsGallery)



	dropdown.addEventListener('click', e => {
		e.preventDefault();
		dropdownOptions.classList.toggle('hidden');
	})


});

const searchForm = document.querySelector('.search-form');
const searchInput = searchForm.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const searchSuggestions = document.querySelector('.search-suggestions');
const resultsGallery = document.getElementById('results-gallery');
const suggestionsGallery = document.getElementById('suggestions-gallery')

searchInput.addEventListener('input', async e => {
	e.preventDefault();
	if (e.target.value === '') {

		searchSuggestions.classList.add('hidden')
		searchButton.classList.add('inactive')
		searchButton.classList.remove('hover');
		searchButton.disabled = true;
		localStorage.getItem('activeTheme') == "day-theme" ? searchButton.firstElementChild.src = 'assests/img/lupa_inactive.svg' : searchButton.firstElementChild.src = './assests/img/lupa_inactive_dark.svg'
	} else {
		const gif = new Gif();
		const data = await gif.autocompleteSearch(e.target.value);
		searchSuggestions.classList.remove('hidden');
		searchButton.classList.remove('inactive');
		searchButton.classList.add('hover');
		searchButton.disabled = false;
		searchButton.firstElementChild.src = './assests/img/lupa.svg'
		searchSuggestions.innerHTML = '';

		for (let i = 0; i < 3; i++) {
			const button = document.createElement('button')
			button.type = 'button'
			button.className = 'suggestion-option';
			button.textContent = data.data[i].name;
			searchSuggestions.appendChild(button)
		}
	}
});

searchSuggestions.addEventListener('click', e => {
	if (e.target.tagName === 'BUTTON') {
		searchInput.value = e.target.textContent;
		searchSuggestions.classList.add('hidden');
		renderResultsGallery(resultsGallery, e.target.textContent, 14)
	}

});

searchForm.addEventListener('submit', e => {
	e.preventDefault();
	searchSuggestions.classList.add('hidden');
	renderResultsGallery(resultsGallery, searchInput.value, 14)

});

suggestionsGallery.addEventListener('click', e => {
	if (e.target.tagName === 'BUTTON') {
		renderResultsGallery(resultsGallery, e.target.dataset.topic, 14)
	}

})

function checkHistory(nueva) {
	let cantidadBusquedas = []
	let busquedaValues = []
	let busquedasGrabadas = JSON.parse(localStorage.getItem('busquedasGifs'))
	let busquedasGifs = new Object()

	if (busquedasGrabadas == null) {
		console.log('paso por null')
		busquedasGifs.busqueda0 = nueva
	}

	else {
		console.log('paso por else')
		busquedaValues = Object.values(busquedasGrabadas)
		cantidadBusquedas = Object.keys(busquedasGrabadas)
		busquedaValues.unshift(nueva)
		for (i = 0; i < busquedaValues.length; i++) {
			busquedasGifs['busqueda' + i] = busquedaValues[i]
		}
	}
	console.log(busquedasGifs)
	localStorage.setItem('busquedasGifs', JSON.stringify(busquedasGifs))

	return busquedasGifs
}

function renderHistory(nueva) {

	let busquedasGifs = checkHistory(nueva)
	const searchHistory = document.getElementById('search-history')

	searchHistory.classList.remove('hidden')
	searchHistory.innerHTML = ''
	let valores = Object.values(busquedasGifs)
	for (var i = 0; i < valores.length; i++) {
		const button = document.createElement('button');
		button.className = 'history-button';
		button.innerText = '#' + valores[i]
		searchHistory.appendChild(button);
	}
}

function formatTitleTrending(title) {
	let arrayTitle = title.split(" ")
	let titleP = arrayTitle.slice(0, (arrayTitle.indexOf("GIF")))
	let nuevoArray = titleP.map((e) => '#' + e.toLowerCase())
	let formatTitle = nuevoArray.toString().replaceAll(',', " ")
	return formatTitle
}
