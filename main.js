import { createInterface } from 'readline';
import { getMapData, getGeneralData, submitSolution } from './api.js';
import { calculateScore } from './scoring.js';

// Enter your API key here!
const apiKey = '';

if (apiKey.trim() === '') {
  console.log('Configure apiKey');
}

console.log('1: Stockholm');
console.log('2: Goteborg');
console.log('3: Malmo');
console.log('4: Uppsala');
console.log('5: Vasteras');
console.log('6: Orebro');
console.log('7: London');
console.log('8: Linkoping');
console.log('9: Berlin');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Select the map you wish to play: ', async (option) => {
  const mapName = (() => {
    switch (option) {
      case '1':
        return 'stockholm';
      case '2':
        return 'goteborg';
      case '3':
        return 'malmo';
      case '4':
        return 'uppsala';
      case '5':
        return 'vasteras';
      case '6':
        return 'orebro';
      case '7':
        return 'london';
      case '8':
        return 'linkoping';
      case '9':
        return 'berlin';
      default:
        console.log('Invalid map selected');
        rl.close();
        return null;
    }
  })();

  if (!mapName) {
    return;
  }

  const mapData = await getMapData(apiKey, mapName);
  const generalData = await getGeneralData(apiKey);
  const solution = {
    Locations: {},
  };

  // <---- Your algorithm starts here ---->

  Object.entries(mapData.locations).forEach(([locationKey, location]) => {
    const salesVolume = location.salesVolume;
    if (salesVolume > 100) {
      solution.Locations[location.locationName] = {
        freestyle3100Count: 0,
        freestyle9100Count: 1,
      };
    }
  });

  // <---- Your algorithm ends here ---->

  // Below is for calculating the score, since there will be a request limit for the Considition apis so if you wish to train a AI/ML
  const score = calculateScore(mapName, solution, mapData, generalData);
  console.log(`GameScore: ${score.gameScore.total}`);

  const prodScore = await submitSolution(mapName, solution, apiKey); // You can comment me
  console.log(`GameId: ${prodScore.id}`); // and me out to not submit your solution and only get your score!
  rl.close();
});
