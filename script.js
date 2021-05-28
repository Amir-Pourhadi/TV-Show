async function getData(url) {
	try {
		const { data } = await axios.get(url);

		const searchInput = document.querySelector(".form-control");
		const episodeSelect = document.querySelector(".episode-select");

		searchInput.value = "";
		episodeSelect.innerText = "";

		addEpisodes(data);
		showCards(data);

		episodeSelect.addEventListener("change", () => showCards(data, episodeSelect.value));
		searchInput.addEventListener("input", () => showCards(data, searchInput.value));
	} catch (error) {
		alert("OMG! You faced an error and I don't know how to handle it :))");
	}
}

function showCards(data, value) {
	document.querySelector("main").innerText = "";

	for (const { url, name, season, number, image, summary } of search(data, value))
		createCard(url, name, season, number, image, summary);
}

function search(data, value) {
	const inputLabel = document.querySelector(".input-group-text");

	if (!value) {
		inputLabel.classList.remove("bg-success");
		inputLabel.classList.add("bg-warning");
		inputLabel.innerText = "Search";
		return data;
	}

	inputLabel.classList.add("bg-success");
	inputLabel.classList.remove("bg-warning");
	inputLabel.classList.remove("bg-danger");

	const regExp = new RegExp(value, "i");
	const filteredData = data.filter(
		({ name, summary, season, number }) =>
			regExp.test(name) || regExp.test(summary) || regExp.test(getEpisodeNum(season, number))
	);

	inputLabel.innerText = filteredData.length + "/" + data.length;

	if (!filteredData.length) {
		inputLabel.classList.remove("bg-success");
		inputLabel.classList.add("bg-danger");
	}
	return filteredData;
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
	header.append(`${name} - ${getEpisodeNum(season, number)}`);
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

function getEpisodeNum(season, number) {
	return `S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
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

function addEpisodes(data) {
	const episodeSelect = document.querySelector(".episode-select");

	const defaultOption = document.createElement("option");
	defaultOption.value = "";
	defaultOption.append("All Episodes");
	episodeSelect.appendChild(defaultOption);

	for (const { name, season, number } of data) {
		const episodeCode = getEpisodeNum(season, number);

		const option = document.createElement("option");
		option.value = episodeCode;
		option.append(`${episodeCode} - ${name}`);
		episodeSelect.appendChild(option);
	}
}

const currentAPI = document.querySelector(".api-select");
window.addEventListener("load", (evt) => getData(currentAPI.value));
currentAPI.addEventListener("change", (evt) => getData(evt.target.value));
