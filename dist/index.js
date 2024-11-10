"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importation des dépendances
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = __importDefault(require("./routes/user/userRoute"));
const surveyRoute_1 = __importDefault(require("./routes/admin/surveyRoute"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
// Configuration de cors
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('trust proxy', 1);
// Route racine
// app.get("/", async (req: Request, res: Response) => {
//     try {
//       const post = await prisma.survey.findUnique({
//         where: {
//           id: "67139ba729f6d26d45c4dd07",
//         },
//       });
//       if (post) {
//         res.json({
//           status: "success",
//           data: post
//         });
//       } else {
//         res.status(404).json({ message: "Sondage non trouvé" });
//       }
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
// });
app.get("/", (req, res) => {
    res.json({ message: "Bienvenue sur l'API" });
});
// Enregistrement des autres routes
app.use('/api', userRoute_1.default);
app.use('/api/admin', surveyRoute_1.default);
// Middleware pour gérer les routes non trouvées
app.use('*', (req, res) => {
    res.status(404).json({
        message: `La route ${req.originalUrl} n'existe pas - 404 Route not found`
    });
});
const PORT = process.env.PORT || 80;
// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours de marche et disponible sur http://localhost:${PORT}`);
    console.log(`Documentation disponible sur http://localhost:${PORT}/api-docs`);
});
