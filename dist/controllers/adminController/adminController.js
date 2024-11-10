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
exports.getStatistics = exports.createSurvey = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// fonction qui permet la creation de sondage
const createSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, questions } = req.body;
    try {
        const survey = yield prisma.survey.create({
            data: {
                title,
                description,
                questions: {
                    create: questions.map((q) => ({
                        text: q.text,
                        questionType: q.questionType,
                        options: q.options ? { create: q.options.map((opt) => ({ text: opt })) } : undefined,
                    })),
                },
            },
        });
        res.status(201).json(survey);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createSurvey = createSurvey;
const getStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statistics = yield prisma.statistics.findMany();
        res.json(statistics);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getStatistics = getStatistics;
