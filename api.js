import fetch from 'node-fetch';

const BASE_URL = 'https://api.considition.com/api/game';

const get = async (apiKey, endpoint) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    headers: {'x-api-key': apiKey}
  });
  return await res.json();
}

export const getMapData = async (apiKey, mapName) => {
  return await get(apiKey, `getmapdata?mapName=${encodeURIComponent(mapName)}`)
};

export const getGeneralData = async (apiKey) => {
  return await get(apiKey, `getgeneralgamedata`)
};

export const getGame = async (apiKey, mapName) => {
  return await get(apiKey, `getgamedata/${id}`)
};

export const submitSolution = async (mapName, solution, apiKey) => {
  const res = await fetch(
    `${BASE_URL}/submitSolution?mapName=${encodeURIComponent(mapName)}`,
    {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(solution),
    }
  );
  return await res.json();
};
