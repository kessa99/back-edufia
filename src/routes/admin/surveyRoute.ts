import { Router } from 'express';
import { submitSurveyResponse } from '../../controllers/simpleUserController/simpleController'; 
import { sendErrorResponse } from '../../utils/response/responseUtils';
import { addOptionToQuestion, addQuestionToSurvey, createSurvey } from '../../controllers/adminController/surveyCtrl';

const router = Router();

router.post("/surveys", async (req, res) => {
    try {
        await createSurvey(req, res);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/surveys/:surveyId/questions", async (req, res) => {
    try {
        await addQuestionToSurvey(req, res);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/surveys/:surveyId/questions/:questionId/options", async (req, res) => {
    try {
        await addOptionToQuestion(req, res);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}); 



export default router;
