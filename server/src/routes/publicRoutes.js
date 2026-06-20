import express from 'express';
import dashboardConfig from '../config/dashboardConfig.js';

const router = express.Router();

router.get('/dashboard-config', (req, res) => {
  try {
    res.json({
      success: true,
      websiteType: dashboardConfig.websiteType,
      enabledModules: dashboardConfig.enabledModules,
      modules: dashboardConfig.modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard config',
    });
  }
});

export default router;
