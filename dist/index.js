"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. Importation des dépendances
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = __importDefault(require("./routes/user/userRoute"));
// 2. Initialisation de l'application express
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
// 2.1. Configuration de cors
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};
// 3. Middleware
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('trust proxy', 1);
// 4. Enregistrement des routes
app.use('/api', userRoute_1.default); // Placer les routes avant le middleware 404
// Middleware pour gérer les routes non trouvées (404)
app.use('*', (req, res, next) => {
    res.status(404).json({
        message: `La route ${req.originalUrl} n'existe pas - 404 Route not found`
    });
});
console.timeLog('Demarrage du serveur', 'Initialisation des middlewares');
const PORT = process.env.PORT || 3000;
// 5. Démarrage du serveur
app.listen(PORT, () => {
    console.timeEnd('Demarrage du serveur');
    console.log(`Serveur en cours de marche et disponible sur le http://localhost:${PORT}`);
    console.log(`Decouvrez la documentation de notre api pour se projet sur http://localhost:${PORT}/api-docs`);
});
