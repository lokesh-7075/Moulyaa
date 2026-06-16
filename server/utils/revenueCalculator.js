const calculateRevenue = (amount) => {

  return {
    providerShare: amount * 0.75,
    platformShare: amount * 0.25
  };

};

module.exports = calculateRevenue;