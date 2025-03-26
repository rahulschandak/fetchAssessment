const apiUrl = import.meta.env.VITE_API_URL;

export const fetchBreeds = async () => {
  try {
    const response = await fetch(`${apiUrl}/dogs/breeds`, {
      credentials: "include",
    });
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchDogs = async (
  query = "",
  sortField = "breed",
  sortOrder = "asc",
  itemsPerPage = "10"
) => {
  try {
    const searchResponse = await fetch(
      `${apiUrl}/dogs/search?sort=${sortField}:${sortOrder}&size=${itemsPerPage}${query}`,
      { credentials: "include" }
    );
    const searchData = await searchResponse.json();
    const resultIds = searchData.resultIds;

    if (resultIds.length === 0) {
      return { dogs: [], nextPage: null, prevPage: null };
    }

    const dogDetails = await fetch(`${apiUrl}/dogs`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultIds),
    }).then((res) => res.json());

    return {
      dogs: dogDetails,
      nextPage: searchData.next,
      prevPage: searchData.prev,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
