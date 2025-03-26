const apiUrl = import.meta.env.VITE_API_URL;

export const fetchBreeds = async () => {
  try {
    const response = await fetch(`${apiUrl}/dogs/breeds`, { credentials: "include" });
    return await response.json();
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
};

export const fetchDogs = async (query = "", sortField = "breed", sortOrder = "asc") => {
  try {
    const searchResponse = await fetch(
      `${apiUrl}/dogs/search?sort=${sortField}:${sortOrder}&size=10${query}`,
      { credentials: "include" }
    );
    const searchData = await searchResponse.json();

    if (!searchData.resultIds.length) return { dogs: [], nextPage: null, prevPage: null };

    const dogDetails = await fetch(`${apiUrl}/dogs`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(searchData.resultIds),
      body: JSON.stringify(searchData.resultIds),
    }).then((res) => res.json());

    return { dogs: dogDetails, nextPage: searchData.next, prevPage: searchData.prev };
  } catch (error) {
    console.error("Error fetching dogs:", error);
    throw error;
  }
};

export const generateMatch = async (favorites) => {
  if (!favorites.length) throw new Error("Please select at least one favorite dog.");

  try {
    const response = await fetch(`${apiUrl}/dogs/match`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(favorites),
    });

    if (!response.ok) throw new Error("Match generation failed.");

    const matchData = await response.json();

    const matchedDogResponse = await fetch(`${apiUrl}/dogs`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify([matchData.match]),
    });

    return await matchedDogResponse.json();
  } catch (error) {
    console.error("Error generating match:", error);
    throw error;
  }
};
