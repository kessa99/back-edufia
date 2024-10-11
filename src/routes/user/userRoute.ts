import { Router } from 'express';
import { getSurveyDetails, submitSurveyResponse } from '../../controllers/simpleUserController/simpleController'; 
import { sendErrorResponse } from '../../utils/response/responseUtils';
const router = Router();

router.post("/submit-survey", async (req, res) => {
  try {
    await submitSurveyResponse(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/surveys/:surveyId", async (req, res) => {
  try {
    await getSurveyDetails(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
