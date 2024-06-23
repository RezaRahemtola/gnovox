export const displayBalance = (ugnot: number) => {
	const gnot = ugnot / 1000000;
	return displayGnot(gnot);
};

export const displayGnot = (gnot: number) => {
	return `${gnot.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	})} GNOT`;
};
