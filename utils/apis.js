const API_URL =
	"https://5qfov74y3c.execute-api.ap-northeast-2.amazonaws.com/web-front/autocomplete";

export const fetchData = async (value) => {
	try {
		const res = await fetch(`${API_URL}?value=${value}`).then((res) =>
			res.json()
		);
		return res;
	} catch (error) {
		console.error(error);
		return [];
	}
};
