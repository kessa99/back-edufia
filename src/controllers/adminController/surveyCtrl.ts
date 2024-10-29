import { Request, Response } from 'express';
import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

export const createSurvey = async (req: Request, res: Response) => {
    const { titl, description } = req.body;

    try {

        // verifier que le titre et la description sont present
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        // verifier que le titre n'existe pas deja
        const existingSurvey = await prisma.survey.findUnique({
            where: { title }
        });

        if (existingSurvey) {
            return res.status(400).json({ error: 'Sondage avec ce titre existe deja' });
        }

        // enregistrer le sondage
        const survey = await prisma.survey.create({
            data: {
                title,
                description
            }
        });

        return res.status(201).json(survey);
        
                
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * fonction pour ajouter une question a un sondage
*/
export const addQuestionToSurvey = async (req: Request, res: Response) => {

    const { surveyId } = req.params;
    const { text, questionType } = req.body;

    try {

        // verifier que le sondage existe
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId }
        });

        if (!survey) {
            return res.status(404).json({ error: 'Sondage non trouve' });
        }

        //verifier que le type de question est valide
        if (!Object.values(QuestionType).includes(questionType)) {
            return res.status(400).json({ error: 'Type de question invalide' });
        }

        // verifier que le texte de la question est present
        if (!text) {
            return res.status(400).json({ error: 'Question text is required' });
        }
        // creer la question
        const question = await prisma.question.create({
            data: {
                text,
                questionType,
                surveyId
            }
        })  

        return res.status(201).json(question);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * fonction pour ajouter une option a une question
*/
export const addOptionToQuestion = async (req: Request, res: Response) => {
    const { surveyId, questionId } = req.params;
    const { text } = req.body;

    try {

        // verifier que le sondage existe
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId }
        });

        if (!survey) {
            return res.status(404).json({ error: 'Sondage non trouve' });
        }

        // verifier que la question existe
        const question = await prisma.question.findUnique({
            where: { id: questionId }
        });

        if (!question) {
            return res.status(404).json({ error: 'Question non trouve' });
        }

        // en fonction du type de question, creer l'option
        let option;
        if (question.questionType === QuestionType.MULTIPLE_CHOICE || question.questionType === QuestionType.SINGLE_CHOICE) {
            option = await prisma.option.create({
                data: {
                    text,
                    questionId
                }
            })
        }

        return res.status(201).json(option);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

