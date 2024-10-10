"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSurveyResponse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const submitSurveyResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { surveyId, responses } = req.body;
    try {
        const survey = yield prisma.survey.findUnique({
            where: { id: surveyId },
            include: { questions: true },
        });
        if (!survey) {
            return res.status(404).json({ error: 'Sondage non trouvé.' });
        }
        const responseData = responses.map((resp) => {
            const question = survey.questions.find(q => q.id === resp.questionId);
            if (!question) {
                throw new Error('Question non trouvée.');
            }
            if (question.questionType === 'SINGLE_CHOICE' || question.questionType === 'MULTIPLE_CHOICE') {
                return {
                    questionId: resp.questionId,
                    optionId: resp.optionId, // La réponse est l'ID de l'option choisie
                };
            }
            if (question.questionType === 'TEXT' || question.questionType === 'RATING') {
                return {
                    questionId: resp.questionId,
                    textResponse: resp.textResponse, // La réponse est du texte ou une note
                };
            }
        });
        const response = yield prisma.response.createMany({
            data: responseData,
        });
        return res.status(201).json(response); // NE PAS retourner la réponse ici. Envoyer la réponse avec res.status(...).json(...)
    }
    catch (error) {
        return res.status(500).json({ error: 'Erreur lors de la soumission des réponses.' });
    }
});
exports.submitSurveyResponse = submitSurveyResponse;
