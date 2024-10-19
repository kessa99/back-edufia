import { Router } from 'express';
import { 
  submitSurveyResponse, 
  getOptionResponses, 
  getTextResponses, 
  getRatingResponses, 
  getSurvey, 
  createSurvey, 
  deleteSurvey, 
  updateSurvey, 
  getSurveyDetails
} from '../../controllers/simpleUserController/simpleController';

import { sendErrorResponse } from '../../utils/response/responseUtils';

const router = Router();

// creation d'un sondage
router.post("/create-survey", async (req, res) => {
  try {
    await createSurvey(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// suppression d'un sondage
router.delete("/delete-survey/:id", async (req, res) => {
  try {
    await deleteSurvey(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// modification d'un sondage
router.put("/update-survey/:id", async (req, res) => {
  try {
    await updateSurvey(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/submit-survey", async (req, res) => {
  try {
    await submitSurveyResponse(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/surveys/:id/questions-responses", async (req, res) => {
  try {
    await getSurveyDetails(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});



router.get("/surveys/:surveyId/responses/options", async (req, res) => {
  try {
    await getOptionResponses(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/surveys/:surveyId/responses/text", async (req, res) => {
  try {
    await getTextResponses(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/surveys/:surveyId/responses/rating", async (req, res) => {
  try {
    await getRatingResponses(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/surveys/:id", async (req, res) => {
  try {
    await getSurvey(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});



export default router;
