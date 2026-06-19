import express from 'express';
import protect from '../middleware/auth.js';
import teamUpload from '../middleware/teamUpload.js';
import {
  createTeamMember,
  createTeamWork,
  deleteTeamMember,
  deleteTeamWork,
  deleteTeamWorkMedia,
  getTeam,
  getTeamMember,
  updateTeamMember,
  updateTeamWork,
} from '../controllers/teamController.js';

const router = express.Router();

router.get('/', getTeam);
router.get('/:id', getTeamMember);

router.post('/', protect, teamUpload.single('avatar'), createTeamMember);
router.put('/:id', protect, teamUpload.single('avatar'), updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

router.post('/:id/works', protect, teamUpload.array('work', 12), createTeamWork);
router.put('/:id/works/:workId', protect, teamUpload.array('work', 12), updateTeamWork);
router.delete('/:id/works/:workId', protect, deleteTeamWork);
router.delete('/:id/works/:workId/media/:mediaId', protect, deleteTeamWorkMedia);

export default router;
