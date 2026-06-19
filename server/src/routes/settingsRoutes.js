import express from 'express';import protect from '../middleware/auth.js';import{getSettings,updateSettings}from'../controllers/settingsController.js';
const router=express.Router();router.get('/',getSettings);router.put('/',protect,updateSettings);export default router;
