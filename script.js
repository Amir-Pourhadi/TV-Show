async function getData(url) {
	try {
		const { data } = await axios.get(url);

		document.body.style.background = "linear-gradient(#4568dc, #b06ab3)";
		const searchInput = document.querySelector(".form-control");
		const episodeSelect = document.querySelector(".episode-select");

		searchInput.value = "";
		episodeSelect.innerText = "";

		makeScrollBtn();
		addEpisodes(data);
		showCards(data, searchInput.value);

		episodeSelect.addEventListener("change", () => showCards(data, episodeSelect.value));
		searchInput.addEventListener("input", () => showCards(data, searchInput.value));
	} catch (error) {
		alert("OMG! You faced an error and I don't know how to handle it 😭");
	}
}

function showCards(data, value) {
	document.querySelector("main").innerText = "";
	const filteredData = search(data, value);
	if (filteredData.length < 4) document.body.style.height = "100vh";
	else document.body.style.removeProperty("height");

	for (const { url, name, season, number, image, summary } of filteredData)
		createCard(url, name, season, number, image, summary);
}

function search(data, value) {
	const inputLabel = document.querySelector(".input-group-text");
	const footer = document.querySelector("footer");

	if (!value) {
		inputLabel.classList.remove("bg-danger");
		inputLabel.classList.add("bg-success");
		inputLabel.innerText = data.length + "/" + data.length;
		footer.classList.remove("invisible");
		return data;
	}
	
	inputLabel.classList.add("bg-success");
	inputLabel.classList.remove("bg-danger");
	footer.classList.add("invisible");

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

	const header = document.createElement("div");
	header.className = "card-header text-center w-100";

	const urlDiv = document.createElement("a");
	urlDiv.style.textDecoration = "none";
	urlDiv.style.color = "black";
	urlDiv.href = url;
	urlDiv.target = "/";
	urlDiv.append(`${name} - ${getEpisodeNum(season, number)}`);

	header.appendChild(urlDiv);

	card.appendChild(header);

	const innerCard = document.createElement("div");
	innerCard.className = "card-inner d-flex justify-content-center w-100 h-100";

	const front = document.createElement("div");
	front.className = "card-front";

	const img = document.createElement("img");
	img.src = image.medium;
	img.alt = name;
	img.className = "card-img";
	front.appendChild(img);

	innerCard.appendChild(front);

	const back = document.createElement("div");
	back.className = "card-back";

	const desc = document.createElement("p");
	desc.className = "card-desc position-absolute fs-6";

	desc.append(shortDescText(summary));
	back.appendChild(desc);

	innerCard.appendChild(back);

	card.appendChild(innerCard);

	container.appendChild(card);
}

function getEpisodeNum(season, number) {
	return `S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
}

function shortDescText(summary) {
	let lastIndex = summary.lastIndexOf(".");
	let result = summary.slice(3, lastIndex);
	while (result.length > 260) {
		lastIndex = result.lastIndexOf(".");
		result = result.slice(0, lastIndex);
	}
	return result + ".";
}

/* ---------------------- Add Option to Episode Select ---------------------- */
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

/* ------------------------------ Scroll Button ----------------------------- */
function makeScrollBtn() {
	const scrollBtn = document.createElement("i");
	scrollBtn.className = "scroll-btn fas fa-chevron-circle-up position-fixed invisible";
	document.body.appendChild(scrollBtn);

	scrollBtn.addEventListener("click", () => (document.documentElement.scrollTop = 0));
}

function showScrollBtn() {
	const scrollBtn = document.querySelector(".scroll-btn");
	document.documentElement.scrollTop > 600
		? scrollBtn.classList.remove("invisible")
		: scrollBtn.classList.add("invisible");
}

/* -------------------- Load Page and Change Movie Events ------------------- */
const currentAPI = document.querySelector(".api-select");
window.addEventListener("load", () => getData(currentAPI.value));
currentAPI.addEventListener("change", (evt) => getData(evt.target.value));
window.addEventListener("scroll", showScrollBtn);
