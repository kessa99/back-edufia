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
const express_1 = require("express");
const simpleController_1 = require("../../controllers/simpleUserController/simpleController");
const router = (0, express_1.Router)();
// creation d'un sondage
router.post("/create-survey", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, simpleController_1.createSurvey)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// suppression d'un sondage
router.delete("/delete-survey/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, simpleController_1.deleteSurvey)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// modification d'un sondage
router.put("/update-survey/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, simpleController_1.updateSurvey)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.post("/submit-survey", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, simpleController_1.submitSurveyResponse)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/surveys/:id/questions-responses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, simpleController_1.getSurveyDetails)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/surveys/:surveyId/responses/options", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, simpleController_1.getOptionResponses)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/surveys/:surveyId/responses/text", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, simpleController_1.getTextResponses)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/surveys/:surveyId/responses/rating", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, simpleController_1.getRatingResponses)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.get("/surveys/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, simpleController_1.getSurvey)(req, res);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
