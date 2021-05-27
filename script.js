async function getData(url) {
	const input = document.querySelector(".form-control");
	try {
		const { data } = await axios.get(url);
		showCards(data);
		input.addEventListener("input", () => showCards(data));
	} catch (error) {
		alert("OMG! You faced an error and I don't know how to handle it :))");
	}
}

function showCards(data) {
	document.querySelector("main").innerText = "";

	for (const { url, name, season, number, image, summary } of search(data)) {
		createCard(url, name, season, number, image, summary);
	}
}

function search(data) {
	const input = document.querySelector(".form-control");
	const inputLabel = document.querySelector(".input-group-text");

	if (!input.value) {
		inputLabel.classList.remove("bg-success");
		inputLabel.classList.add("bg-warning");
		inputLabel.innerText = "Search";
		return data;
	}

	inputLabel.classList.add("bg-success");
	inputLabel.classList.remove("bg-warning");
	inputLabel.classList.remove("bg-danger");

	const regExp = new RegExp(input.value, "i");
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

const currentAPI = document.querySelector(".api-select");
window.addEventListener("load", (evt) => getData(currentAPI.value));
currentAPI.addEventListener("change", (evt) => getData(evt.target.value));