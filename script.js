const data = getData("https://api.tvmaze.com/shows/82/episodes");

async function getData(url) {
	try {
		const { data } = await axios.get(url);
		return data;
	} catch (error) {
		//TODO do sth to catch errors
		console.log(error);
	}
}
