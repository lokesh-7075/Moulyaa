// ===============================
// PROVIDER DASHBOARD CONTROLLER
// ===============================

const providerDashboard = async (req, res) => {

  try {

    res.json({
      message: "Provider dashboard loaded",
      provider: req.user
    });

  } catch (error) {

    res.status(500).json({
      message: "Error loading provider dashboard",
      error: error.message
    });

  }

};

module.exports = {
  providerDashboard
};