// Importation des dépendances
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

dotenv.config();
const prisma = new PrismaClient();
const app = express();

// Configuration de cors
const corsOptions = {
    origin: 'https://edufiasurveys.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Bienvenue sur l'API" });
});

// Enregistrement des autres routes
app.use('/api', userRoute);  
app.use('/api/admin', surveyRoute);

// Middleware pour gérer les routes non trouvées
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
        message: `La route ${req.originalUrl} n'existe pas - 404 Route not found`
    });
});

const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours de marche et disponible sur http://localhost:${PORT}`);
    console.log(`Documentation disponible sur http://localhost:${PORT}/api-docs`);
});
