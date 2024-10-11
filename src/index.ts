// 1. Importation des dépendances
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import userRoute from './routes/user/userRoute';
import surveyRoute from './routes/admin/surveyRoute';

// 2. Initialisation de l'application express
dotenv.config();
const prisma = new PrismaClient();
const app = express();

// 2.1. Configuration de cors
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// 3. Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

// 4. Enregistrement des routes
app.use('/api', userRoute);  // Placer les routes avant le middleware 404
app.use('/api/admin', surveyRoute);  // Placer les routes avant le middleware 404

// Middleware pour gérer les routes non trouvées (404)
app.use('*', (req: Request, res: Response, next: NextFunction) => {
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
