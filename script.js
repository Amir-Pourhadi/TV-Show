const data = getData("https://api.tvmaze.com/shows/82/episodes");

async function getData(url) {
	try {
		const { data } = await axios.get(url);
		for (const { url, name, season, number, image, summary } of data) {
			createCard(url, name, season, number, image, summary);
		}
	} catch (error) {
		//TODO do sth to catch errors
		console.log(error);
	}
}

function createCard(url, name, season, number, image, summary) {
	const container = document.querySelector("main");
	const card = document.createElement("div");
	card.className = "card shadow";

	const urlDiv = document.createElement("a");
	urlDiv.style.textDecoration = "none";
	urlDiv.style.color = "black";
	urlDiv.href = url;
	urlDiv.target = "/";

	const header = document.createElement("div");
	header.className = "card-header text-center border border-3 border-success rounded-pill";
	header.append(`${name} - S${getEpisodeNum(season)}E${getEpisodeNum(number)}`);
	urlDiv.appendChild(header);

	card.appendChild(urlDiv);

	const img = document.createElement("img");
	img.src = image.medium;
	img.alt = name;
	img.className = "card-img m-auto";
	card.appendChild(img);

	const desc = document.createElement("p");
	desc.className = "card-desc position-absolute text-center invisible";

	desc.append(shortDescText(summary));
	card.appendChild(desc);

	container.appendChild(card);

	function changeVisibility() {
		img.classList.toggle("invisible");
		desc.classList.toggle("invisible");
	}

	card.addEventListener("mouseover", changeVisibility);
	card.addEventListener("mouseout", changeVisibility);
}

function getEpisodeNum(number) {
	return number.toString().padStart(2, "0");
}

function shortDescText(summary) {
	let lastIndex = summary.lastIndexOf(".");
	let result = summary.slice(3, lastIndex);
	while (result.length > 250) {
		lastIndex = result.lastIndexOf(".");
		result = result.slice(0, lastIndex);
	}
	return result + ".";
}
