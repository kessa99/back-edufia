import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const submitSurveyResponse = async (req: Request, res: Response) => {
    const { surveyId, responses } = req.body;

    try {
        // Vérifier si le sondage existe
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
        });

        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        // Liste des promesses pour traiter toutes les réponses en parallèle
        const responsePromises = responses.map(async (response: any) => {
            const { questionId, optionId, textResponse, rating } = response;

            // Récupérer la question
            const question = await prisma.question.findUnique({
                where: { id: questionId },
            });

            if (!question) {
                throw new Error(`Question with id ${questionId} not found`);
            }

            // Traitement selon le type de question
            if (question.questionType === 'SINGLE_CHOICE') {
                if (!optionId || typeof optionId !== 'string') {
                    throw new Error('OptionId is required for single_choice questions and must be a string');
                }

                // Créer la réponse pour la question à choix unique
                const createdResponse = await prisma.response.create({
                    data: {
                        surveyId,
                        questionId,
                    },
                });

                // Créer l'association avec l'option choisie
                await prisma.responseOption.create({
                    data: {
                        responseId: createdResponse.id,
                        optionId, // Liaison de l'option sélectionnée
                        questionId,
                    },
                });

            } else if (question.questionType === 'MULTIPLE_CHOICE') {
                if (!Array.isArray(optionId)) {
                    throw new Error('OptionId must be an array for multiple_choice questions');
                }

                // Créer la réponse pour la question à choix multiple
                const createdResponse = await prisma.response.create({
                    data: {
                        surveyId,
                        questionId,
                    },
                });

                // Associer les options avec la réponse via la table intermédiaire `responseOption`
                const optionPromises = optionId.map((option: string) => {
                    return prisma.responseOption.create({
                        data: {
                            responseId: createdResponse.id,
                            optionId: option,
                            questionId,
                        },
                    });
                });

                await Promise.all(optionPromises);

            } else if (question.questionType === 'TEXT') {
                if (!textResponse) {
                    throw new Error('Text response is required for text questions');
                }

                // Créer la réponse pour une question textuelle
                return prisma.response.create({
                    data: {
                        surveyId,
                        questionId,
                        textResponse,
                    },
                });

            } else if (question.questionType === 'RATING') {
                if (typeof rating !== 'number') {
                    throw new Error('Rating is required and must be a number for rating questions');
                }

                // Créer la réponse pour une question d'évaluation
                return prisma.response.create({
                    data: {
                        surveyId,
                        questionId,
                        answer: rating.toString(), // Enregistrer le rating comme une chaîne
                    },
                });
            }
        });

        // Attendre que toutes les réponses soient traitées
        await Promise.all(responsePromises);

        return res.status(200).json({ message: 'Responses submitted successfully' });
    } catch (error: any) {
        console.error('Error submitting survey response:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getSurveyDetails = async (req: Request, res: Response) => {
    const { surveyId } = req.params;

    try {
        // Vérifier si le sondage existe et récupérer les questions et options associées
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            include: {
                questions: {
                    include: {
                        options: true, // Inclure les options des questions
                    },
                },
            },
        });

        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        return res.status(200).json({ survey });
    } catch (error: any) {
        console.error('Error retrieving survey details:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
