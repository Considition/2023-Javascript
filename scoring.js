export const calculateScore = (mapName, solution, mapData, generalData) => {
  const scored = {
    mapName: mapName,
    teamId: '',
    teamName: '',
    locations: {},
    gameScore: {
      kgCo2Savings: 0,
      earnings: 0,
      totalLeasingCost: 0,
      totalFreestyle3100Count: 0,
      totalFreestyle9100Count: 0,
      totalFootfall: 0,
      totalRevenue: 0,
    },
  };

  const locationListNoRefillStation = {};

  Object.entries(mapData.locations).forEach(([locationKey, location]) => {
    if (solution.Locations[locationKey]) {
      scored.locations[locationKey] = {
        locationName: location.locationName,
        locationType: location.locationType,
        latitude: location.latitude,
        longitude: location.longitude,
        footfall: location.footfall,
        freestyle3100Count: solution.Locations[locationKey].freestyle3100Count,
        freestyle9100Count: solution.Locations[locationKey].freestyle9100Count,
        salesVolume: location.salesVolume * generalData.refillSalesFactor,
        salesCapacity:
          solution.Locations[locationKey].freestyle3100Count *
            generalData.freestyle3100Data.refillCapacityPerWeek +
          solution.Locations[locationKey].freestyle9100Count *
            generalData.freestyle9100Data.refillCapacityPerWeek,
        leasingCost:
          solution.Locations[locationKey].freestyle3100Count *
            generalData.freestyle3100Data.leasingCostPerWeek +
          solution.Locations[locationKey].freestyle9100Count *
            generalData.freestyle9100Data.leasingCostPerWeek,
      };

      if (scored.locations[locationKey].salesCapacity <= 0) {
        throw new Error(
          `You are not allowed to submit locations with no refill stations. Remove or alter location: ${location.locationName}`
        );
      }
    } else {
      locationListNoRefillStation[locationKey] = {
        locationName: location.locationName,
        locationType: location.locationType,
        latitude: location.latitude,
        longitude: location.longitude,
        salesVolume: location.salesVolume * generalData.refillSalesFactor,
      };
    }
  });

  if (Object.keys(scored.locations).length === 0) {
    throw new Error(
      `No valid locations with refill stations were placed for map: ${mapData.mapName}`
    );
  }

  scored.locations = (() => {
    for (const [keyWithout, locationWithout] of Object.entries(
      locationListNoRefillStation
    )) {
      const distributeSalesTo = {};

      for (const [keyWith, locationWith] of Object.entries(scored.locations)) {
        const distance = (() => {
          const r = 6371e3;
          const latRadian1 = (locationWithout.latitude * Math.PI) / 180;
          const latRadian2 = (locationWith.latitude * Math.PI) / 180;
          const latDelta =
            ((locationWith.latitude - locationWithout.latitude) * Math.PI) /
            180;
          const longDelta =
            ((locationWith.longitude - locationWithout.longitude) * Math.PI) /
            180;
          const a =
            Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
            Math.cos(latRadian1) *
              Math.cos(latRadian2) *
              Math.sin(longDelta / 2) *
              Math.sin(longDelta / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = Math.round(r * c);
          return distance;
        })();

        if (distance < generalData.willingnessToTravelInMeters) {
          distributeSalesTo[keyWith] = distance;
        }
      }

      let total = 0;

      if (Object.keys(distributeSalesTo).length > 0) {
        for (const [key, value] of Object.entries(distributeSalesTo)) {
          distributeSalesTo[key] =
            Math.pow(
              generalData.constantExpDistributionFunction,
              generalData.willingnessToTravelInMeters - value
            ) - 1;
          total += distributeSalesTo[key];
        }

        for (const [key, value] of Object.entries(distributeSalesTo)) {
          scored.locations[key].salesVolume +=
            (distributeSalesTo[key] / total) *
            generalData.refillDistributionRate *
            locationWithout.salesVolume;
        }
      }
    }

    return scored.locations;
  })();

  Object.entries(scored.locations).forEach(([locationKey, location]) => {
    location.salesVolume = Math.round(location.salesVolume);

    const sales = location.salesVolume;
    if (location.salesCapacity < location.salesVolume) {
      location.sales = location.salesCapacity;
    }

    location.gramCo2Savings =
      sales *
      (generalData.classicUnitData.co2PerUnitInGrams -
        generalData.refillUnitData.co2PerUnitInGrams);
    scored.gameScore.kgCo2Savings += location.gramCo2Savings / 1000;

    if (location.gramCo2Savings > 0) {
      location.isCo2Saving = true;
    }

    location.revenue = sales * generalData.refillUnitData.profitPerUnit;
    scored.gameScore.totalRevenue += location.revenue;

    location.earnings = location.revenue - location.leasingCost;

    if (location.earnings > 0) {
      location.isProfitable = true;
    }

    scored.gameScore.totalLeasingCost += location.leasingCost;
    scored.gameScore.totalFreestyle3100Count += location.freestyle3100Count;
    scored.gameScore.totalFreestyle9100Count += location.freestyle9100Count;
    scored.gameScore.totalFootfall += location.footfall;
  });

  scored.totalRevenue = Math.round(scored.gameScore.totalRevenue);
  scored.gameScore.kgCo2Savings = Math.round(
    scored.gameScore.kgCo2Savings -
      (scored.gameScore.totalFreestyle3100Count *
        generalData.freestyle3100Data.staticCo2) /
        1000 -
      (scored.gameScore.totalFreestyle9100Count *
        generalData.freestyle9100Data.staticCo2) /
        1000
  );

  scored.gameScore.earnings =
    scored.gameScore.totalRevenue - scored.gameScore.totalLeasingCost;

  scored.gameScore.total = Math.round(
    (scored.gameScore.kgCo2Savings * generalData.co2PricePerKiloInSek +
      scored.gameScore.earnings) *
      (1 + scored.gameScore.totalFootfall)
  );

  return scored;
};
