export const displayBalance = (ugnot: number) => {
	const gnot = ugnot / 1000000;
	return displayGnot(gnot);
};

const displayGnot = (gnot: number) => {
	return `${gnot.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	})} GNOT`;
};

export const parseGnoEvaluateJsonResponse = (response: string): unknown => {
	const regex = /\("(.*)".*\)/;
	const match = response.match(regex);

	if (!match || match.length < 2) {
		throw new Error("invalid post response");
	}

	const cleanResponse: string = match[1].replace(/\\"/g, '"');

	return JSON.parse(cleanResponse);
};
