const data = getData("https://api.tvmaze.com/shows/82/episodes");

async function getData(url) {
	try {
		const { data } = await axios.get(url);
		for (const { url, name, season, number, image, summary } of data) {
			createCard(url, name, season, number, image, summary);
		}
		return data;
	} catch (error) {
		//TODO do sth to catch errors
		console.log(error);
	}
}

function createCard(url, name, season, number, image, summary) {
	const container = document.querySelector("main");
	const card = document.createElement("div");

	const header = document.createElement("div");
	header.append(`${name} - S${getEpisodeNum(season)}E${getEpisodeNum(number)}`);
	card.appendChild(header);

	container.appendChild(card);
}

function getEpisodeNum(number) {
	return number.toString().padStart(2, "0");
}
