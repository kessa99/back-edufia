import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// fonction qui permet la creation de sondage
export const createSurvey = async (req: Request, res: Response) => {

    const { title, description, questions } = req.body;

    try {
        const survey = await prisma.survey.create({
            data: {
                title,
                description,
                questions: {
                    create: questions.map((q: any) => ({
                        text: q.text,
                        questionType: q.questionType,
                        options: q.options ? { create: q.options.map((opt: any) => ({ text: opt }))} : undefined,
                    })),
                },
            },
        });
        res.status(201).json(survey);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

//fonction qui permet d'afficher un sondage avec ses questions et ses options
export const getSurvey = async (req: Request, res: Response) => {
    const { surveyId } = req.params;

    try {
        const survey = await prisma.survey.findUnique({
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
            return res.status(404).json({ error: "Sondage non trouvé" });
        }

        res.json(survey);
        
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const statistics = await prisma.statistics.findMany();
    res.json(statistics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
