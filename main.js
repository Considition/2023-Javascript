import { createInterface } from 'readline';
import { getMapData, getGeneralData, submitSolution } from './api.js';
import { sandboxValidation, calculateScore, SandboxMaps } from './scoring.js';

// Enter your API key here!
export const apiKey = '';

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
console.log("10: GSandbox");
console.log("11: SSandbox");


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
      case '10':
        return 'g-sandbox';
      case '11':
        return 's-sandbox';
      default:
        console.log('Invalid map selected');
        rl.close();
        return null;
    }
  })();

  if (!mapName) {
    return;
  }

  const isHardcore = SandboxMaps.includes(mapName);


  const values = await Promise.all([getMapData(apiKey, mapName), getGeneralData(apiKey)])
  const mapData = values[0];
  const generalData = values[1]; 
  const solution = {
    locations: {},
  };

  if(isHardcore){
    var hotspot = mapData.hotspots[1];
    var hotspot2 = mapData.hotspots[2];

    solution.locations["location1"] = {
        freestyle9100Count: 1,
        freestyle3100Count: 0,
        locationType: generalData.locationTypes["groceryStoreLarge"].type,
        longitude: hotspot.longitude,
        latitude: hotspot.latitude
    }
    solution.locations["location2"] = {
      freestyle9100Count: 0,
      freestyle3100Count: 1,
      locationType: generalData.locationTypes["groceryStore"].type,
      longitude: hotspot2.longitude,
      latitude: hotspot2.latitude
    }
  } else {
    Object.entries(mapData.locations).forEach(([locationKey, location]) => {
      const salesVolume = location.salesVolume;
      if (salesVolume > 100) {
        solution.locations[location.locationName] = {
          freestyle3100Count: 0,
          freestyle9100Count: 1,
        };
      }
    });
  }

  // <---- Your algorithm ends here ---->

  if (isHardcore)
  {
      var hardcoreValidation = sandboxValidation(mapName, solution, mapData);
      if (hardcoreValidation != null)
      {
          throw new Error("Hardcore validation failed");
      }
  }

  // Below is for calculating the score, since there will be a request limit for the Considition apis so if you wish to train a AI/ML
  const score = calculateScore(mapName, solution, mapData, generalData);
  
  console.log(`GameScore: ${score.gameScore.total}`);

  const prodScore = await submitSolution(mapName, solution, apiKey); // You can comment me
  console.log(`GameId: ${prodScore.id}`); // and me out to not submit your solution and only get your score!
  console.log("Gamescore: " + prodScore.gameScore.total)
  rl.close();
});
