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
exports.getSurveyWithQuestionsAndOptions = exports.getSurveyDetails = exports.getRatingResponses = exports.getTextResponses = exports.getOptionResponses = exports.submitSurveyResponse = exports.getSurvey = exports.updateSurvey = exports.deleteSurvey = exports.createSurvey = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// creation d'un sondage
const createSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, questions } = req.body;
    // Valider les données
    if (!title || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Titre et questions sont requis' });
    }
    try {
        // Créer le sondage
        const newSurvey = yield prisma.survey.create({
            data: {
                title,
                description,
                questions: {
                    create: questions.map((question) => ({
                        text: question.text,
                        questionType: question.questionType,
                        options: {
                            create: question.options.map((option) => ({
                                text: option.text,
                            })),
                        },
                    })),
                },
            },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });
        // Répondre avec le sondage créé
        return res.status(201).json(newSurvey);
    }
    catch (error) {
        console.error('Erreur lors de la création du sondage:', error);
        return res.status(500).json({ message: 'Erreur lors de la création du sondage' });
    }
});
exports.createSurvey = createSurvey;
// suppression d'un sondage
const deleteSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Valider l'ID
    if (!id) {
        return res.status(400).json({ message: 'L\'ID du sondage est requis' });
    }
    try {
        // Vérifier si le sondage existe
        const surveyExists = yield prisma.survey.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: true, // Inclure les options pour les supprimer également
                    },
                },
            },
        });
        if (!surveyExists) {
            return res.status(404).json({ message: 'Sondage non trouvé' });
        }
        // Supprimer les options de chaque question
        yield prisma.option.deleteMany({
            where: {
                questionId: {
                    in: surveyExists.questions.map(q => q.id),
                },
            },
        });
        // Supprimer les questions associées
        yield prisma.question.deleteMany({
            where: {
                surveyId: id,
            },
        });
        // Supprimer le sondage
        yield prisma.survey.delete({
            where: { id },
        });
        return res.status(200).json({ message: 'Sondage et ses relations supprimés avec succès' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression du sondage:', error);
        return res.status(500).json({ message: 'Erreur lors de la suppression du sondage' });
    }
});
exports.deleteSurvey = deleteSurvey;
// modifier un sondage
const updateSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, questions } = req.body;
    // Valider l'ID et le corps de la requête
    if (!id || !title || !description || !Array.isArray(questions)) {
        return res.status(400).json({ message: 'L\'ID du sondage, le titre, la description et les questions sont requis.' });
    }
    try {
        // Vérifier si le sondage existe
        const surveyExists = yield prisma.survey.findUnique({
            where: { id },
        });
        if (!surveyExists) {
            return res.status(404).json({ message: 'Sondage non trouvé.' });
        }
        // Mettre à jour le sondage
        const updatedSurvey = yield prisma.survey.update({
            where: { id },
            data: {
                title,
                description,
                updatedAt: new Date(), // Mettre à jour la date
            },
        });
        // Mettre à jour les questions
        for (const question of questions) {
            const { questionId, text, questionType, options } = question;
            // Vérifier si la question existe
            if (questionId) {
                // Mettre à jour la question existante
                yield prisma.question.update({
                    where: { id: questionId },
                    data: {
                        text,
                        questionType,
                        updatedAt: new Date(),
                    },
                });
                // Mettre à jour les options de la question
                if (options && options.length > 0) {
                    for (const option of options) {
                        const { optionId, text: optionText } = option;
                        // Vérifier si l'option existe
                        if (optionId) {
                            // Mettre à jour l'option existante
                            yield prisma.option.update({
                                where: { id: optionId },
                                data: { text: optionText, updatedAt: new Date() },
                            });
                        }
                        else {
                            // Ajouter une nouvelle option
                            yield prisma.option.create({
                                data: {
                                    text: optionText,
                                    questionId: questionId, // ID de la question à laquelle appartient l'option
                                },
                            });
                        }
                    }
                }
            }
            else {
                // Ajouter une nouvelle question si questionId est absent
                yield prisma.question.create({
                    data: {
                        text,
                        questionType,
                        surveyId: id,
                        createdAt: new Date(),
                    },
                });
            }
        }
        return res.status(200).json({ message: 'Sondage modifié avec succès.', survey: updatedSurvey });
    }
    catch (error) {
        console.error('Erreur lors de la modification du sondage:', error);
        return res.status(500).json({ message: 'Erreur lors de la modification du sondage.' });
    }
});
exports.updateSurvey = updateSurvey;
// Fonction qui récupère un sondage avec ses questions et options
const getSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Récupère l'ID du sondage depuis l'URL
    try {
        // Recherche du sondage avec les questions et options associées
        const survey = yield prisma.survey.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });
        // Si le sondage n'est pas trouvé
        if (!survey) {
            return res.status(404).json({ error: "Sondage non trouvé" });
        }
        // Retourne les données du sondage en format JSON
        res.json(survey);
    }
    catch (error) {
        // Gestion des erreurs et envoi d'une réponse en cas de problème
        res.status(500).json({ error: error.message });
    }
});
exports.getSurvey = getSurvey;
const submitSurveyResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { surveyId, responses } = req.body;
    if (!surveyId || !Array.isArray(responses)) {
        return res.status(400).json({ message: 'Entrée invalide : surveyId et responses sont requis' });
    }
    try {
        const survey = yield prisma.survey.findUnique({
            where: { id: surveyId },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });
        if (!survey) {
            return res.status(404).json({ message: 'Sondage non trouvé' });
        }
        const createdResponses = yield Promise.all(responses.map((response) => __awaiter(void 0, void 0, void 0, function* () {
            const { questionId, optionId, textResponse, answer } = response;
            const question = survey.questions.find(q => q.id === questionId);
            if (!question) {
                throw new Error(`Question avec l'id ${questionId} non trouvée`);
            }
            let answerText = '';
            switch (question.questionType) {
                case 'SINGLE_CHOICE':
                case 'MULTIPLE_CHOICE':
                    if (question.questionType === 'SINGLE_CHOICE' && (!optionId || typeof optionId !== 'string')) {
                        throw new Error('OptionId est requis et doit être une chaîne de caractères pour les questions à choix unique');
                    }
                    if (question.questionType === 'MULTIPLE_CHOICE' && !Array.isArray(optionId)) {
                        throw new Error('OptionId doit être un tableau pour les questions à choix multiples');
                    }
                    const selectedOptions = Array.isArray(optionId)
                        ? question.options.filter(opt => optionId.includes(opt.id))
                        : question.options.filter(opt => opt.id === optionId);
                    answerText = selectedOptions.map(opt => opt.text).join(', ');
                    break;
                case 'TEXT':
                    if (typeof textResponse !== 'string') {
                        throw new Error('La réponse textuelle est requise pour les questions de type texte');
                    }
                    answerText = textResponse;
                    break;
                case 'RATING':
                    if (typeof answer !== 'string' && typeof answer !== 'number') {
                        throw new Error('La réponse (answer) est requise et doit être une chaîne ou un nombre pour les questions de type évaluation');
                    }
                    answerText = answer.toString();
                    break;
                default:
                    throw new Error(`Type de question non pris en charge: ${question.questionType}`);
            }
            // Mettre à jour le nombre de participants du sondage
            yield prisma.survey.update({
                where: { id: surveyId },
                data: {
                    participantsCount: {
                        increment: 1,
                    },
                },
            });
            const createdResponse = yield prisma.response.create({
                data: {
                    surveyId,
                    questionId,
                    questionText: question.text,
                    questionType: question.questionType,
                    answerText,
                },
            });
            return {
                questionId: question.id,
                questionText: question.text,
                questionType: question.questionType,
                responseId: createdResponse.id,
                answerText,
            };
        })));
        return res.status(200).json({
            message: 'Réponses soumises avec succès',
            responses: createdResponses,
        });
    }
    catch (error) {
        console.error('Erreur lors de la soumission de la réponse du sondage:', error.message);
        return res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
    }
});
exports.submitSurveyResponse = submitSurveyResponse;
const getOptionResponses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const optionResponses = await prisma.response.findMany({
    //     where: {
    //       options: {
    //         some: {}, // Récupère uniquement les réponses ayant des options associées
    //       },
    //     },
    //     include: {
    //       options: true, // Inclure les options de réponse
    //     },
    //   });
    //   res.status(200).json(optionResponses);
    // } catch (error) {
    //   res.status(500).json({ error: 'Error fetching option responses' });
    // }
});
exports.getOptionResponses = getOptionResponses;
const getTextResponses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const textResponses = await prisma.response.findMany({
    //     where: {
    //       textResponse: {
    //         not: null, // Filtrer uniquement les réponses avec du texte
    //       },
    //     },
    //   });
    //   res.status(200).json(textResponses);
    // } catch (error) {
    //   res.status(500).json({ error: 'Error fetching text responses' });
    // }
});
exports.getTextResponses = getTextResponses;
const getRatingResponses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     // Récupérer toutes les questions de type RATING
    //     const ratingQuestions = await prisma.question.findMany({
    //         where: {
    //             questionType: 'RATING', // Assurez-vous que ce champ est présent dans votre modèle
    //         },
    //         include: {
    //             options: true, // Inclure les options pour chaque question
    //         },
    //     });
    //     // Récupérer les réponses associées aux questions de type RATING
    //     const ratingResponses = await prisma.response.findMany({
    //         where: {
    //             questionId: {
    //                 in: ratingQuestions.map((question) => question.id), // Obtenez les IDs des questions de type RATING
    //             },
    //         },
    //         include: {
    //             options: true, // Inclure les options de réponse si applicable
    //         }, 
    //     });
    //     // Combinez les questions avec les réponses pour une structure plus complète
    //     const combinedResponses = ratingQuestions.map((question) => {
    //         return {
    //             ...question,
    //             responses: ratingResponses.filter(response => response.questionId === question.id),
    //         };
    //     });
    //   res.status(200).json(combinedResponses);
    // } catch (error) {
    //   res.status(500).json({ error: 'Error fetching rating responses' });
    // }
});
exports.getRatingResponses = getRatingResponses;
const getSurveyDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const { id } = req.params;
    //   const survey = await prisma.survey.findUnique({
    //     where: { id },
    //     include: {
    //       questions: {
    //         include: {
    //           options: true,
    //           responses: {
    //             include: {
    //               options: {
    //                 include: {
    //                   option: true, // Inclure les options dans les réponses multiples
    //                 }
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });
    //   if (!survey) {
    //     return res.status(404).json({ message: 'Sondage non trouvé' });
    //   }
    //   const formattedSurvey = {
    //     id: survey.id,
    //     title: survey.title,
    //     description: survey.description,
    //     participantsCount: survey.participantsCount,
    //     questions: survey.questions.map((question) => ({
    //       id: question.id,
    //       text: question.text,
    //       type: question.questionType,
    //       options: question.options.map((option) => ({
    //         id: option.id,
    //         text: option.text,
    //       })),
    //       responses: question.responses.map((response) => ({
    //         id: response.id,
    //         textResponse: response.textResponse,
    //         rating: response.rating,
    //         selectedOptions: response.options.map((responseOption) => ({
    //           id: responseOption.optionId,
    //           text: responseOption.option?.text, // Affichage du texte de l'option
    //         })),
    //       })),
    //     })),
    //   };
    //   return res.status(200).json(formattedSurvey);
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).json({ message: 'Erreur serveur', error });
    // }
});
exports.getSurveyDetails = getSurveyDetails;
// obtenir les le sondage avec les questions et les options
const getSurveyWithQuestionsAndOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching survey with questions and options' });
    }
});
exports.getSurveyWithQuestionsAndOptions = getSurveyWithQuestionsAndOptions;
