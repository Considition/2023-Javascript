import fetch from 'node-fetch';

const BASE_URL = 'https://api.considition.com/api/game';

export const getMapData = async (apiKey, mapName) => {
  const response = await fetch(
    `${BASE_URL}/getmapdata?mapName=${encodeURIComponent(mapName)}`,
    {
      headers: {
        'x-api-key': apiKey,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getGeneralData = async (apiKey) => {
  const response = await fetch(`${BASE_URL}/getgeneralgamedata`, {
    headers: {
      'x-api-key': apiKey,
    },
  });
  const data = await response.json();
  return data;
};

export const getGame = async (apiKey, id) => {
  const response = await fetch(`${BASE_URL}/getgamedata/${id}`, {
    headers: {
      'x-api-key': apiKey,
    },
  });
  const data = await response.json();
  return data;
};

export const submitSolution = async (mapName, solution, apiKey) => {
  const response = await fetch(
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
  const data = await response.json();
  return data;
};
