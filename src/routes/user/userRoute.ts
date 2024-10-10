import { Router } from 'express';
import { submitSurveyResponse } from '../../controllers/simpleUserController/simpleController'; 
import { sendErrorResponse } from '../../utils/response/responseUtils';
const router = Router();

router.post("/submit-survey", async (req, res) => {
  try {
    await submitSurveyResponse(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
