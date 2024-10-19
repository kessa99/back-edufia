import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

const surveys = [
  {
    title: "Sondage sur les finances personnelles du couple",
    description: "Un sondage pour mieux comprendre les habitudes financières des couples.",
    questions: [
        {
            text: "À quelle fréquence discutez-vous de vos finances ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Jamais" },
              { text: "Une fois par mois" },
              { text: "Une fois par semaine" },
              { text: "Plusieurs fois par semaine" },
            ],
        },
        {
            text: "Vous sentez-vous à l’aise pour parler de vos préoccupations financières ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Oui, toujours" },
              { text: "Parfois" },
              { text: "Rarement" },
              { text: "Non, jamais" },
            ],
        },
        {
            text: "Avez-vous des objectifs financiers communs (économiser pour une maison, des vacances, etc.) ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Oui, clairement définis" },
              { text: "Oui, mais pas clairement définis" },
              { text: "Non, nous n’en avons pas" },
            ],
        },
        {
            text: "Avez-vous discuté des étapes pour atteindre ces objectifs ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Oui, en détail" },
              { text: "Oui, mais rapidement" },
              { text: "Non, pas encore" },
            ],
        },
        {
            text: "Avez-vous un budget mensuel que vous suivez ensemble ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Oui, nous le respectons" },
              { text: "Oui, mais pas toujours" },
              { text: "Non, nous n’avons pas de budget" },
            ],
        },
        {
            text: "Qui gère le budget dans votre couple ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Un seul partenaire" },
              { text: "Les deux partenaires ensemble" },
              { text: "Nous n’avons pas de responsable" },
            ],
        },
        {
            text: "Comment décidez-vous des grosses dépenses (meubles, vacances, etc.) ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Nous en discutons toujours ensemble" },
              { text: "L’un de nous prend souvent la décision" },
              { text: "Nous ne discutons pas vraiment des grosses dépenses" },
            ],
        },
        {
            text: "Y a-t-il des dépenses non planifiées qui causent des tensions ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Oui, souvent" },
              { text: "Parfois" },
              { text: "Rarement" },
              { text: "Non, jamais" },
            ],
        },
        {
            text: "Épargnez-vous régulièrement en tant que couple ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Oui, chaque mois" },
              { text: "Oui, mais pas régulièrement" },
              { text: "Non, nous ne mettons pas d'argent de côté" },
            ],
        },
        {
            text: "Avez-vous des investissements ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Oui, nous avons des investissements" },
              { text: "Oui, mais nous n'avons pas encore commencé" },
              { text: "Non, nous n'en avons pas discuté" },
            ],
        },
        {
            text: "Avez-vous des dettes en tant que couple (prêts, cartes de crédit, etc.)?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Oui, beaucoup" },
              { text: "Oui, quelques-unes" },
              { text: "Non, pas de dettes" },
            ],
        },
        {
            text: "Comment gérez-vous vos dettes ensemble ?",
            questionType: "SINGLE_CHOICE",
            options: [
              { text: "Nous avons un plan clair" },
              { text: "Nous avons un plan vague" },
              { text: "Nous ne savons pas comment gérer nos dettes" },
            ],
        },
        {
            text: "Comment gérez-vous les fêtes de fin d'année ?",
            questionType: "TEXT",
        },
        {
            text: "Quelles sont vos principales préoccupations financières en tant que couple ?",
            questionType: "TEXT",
        },
        {
            text: "Y a-t-il des domaines où vous aimeriez améliorer votre gestion financière ?",
            questionType: "TEXT",
        },
        {
            text: "Que souhaiteriez-vous acquérir à l’issue de cette CCF 2024 ?",
            questionType: "TEXT",
        },
        // Question de type rating
        {
            text: "Comment évaluez-vous votre confiance en votre capacité à gérer vos finances en tant que couple ?",
            questionType: "RATING",
            options: [
              { text: "1" },
              { text: "2" },
              { text: "3" },
              { text: "4" },
              { text: "5" },
            ],
        },
    ],
  },
];

async function main() {
    for (const survey of surveys) {
      const createdSurvey = await prisma.survey.create({
        data: {
          title: survey.title,
          description: survey.description,
          questions: {
            create: survey.questions.map((question) => ({
              text: question.text,
              questionType: QuestionType[question.questionType as keyof typeof QuestionType],
              options: question.options
                ? { create: question.options.map(option => ({ text: option.text })) }
                : undefined,
            })),
          },
        },
      });
  
      console.log(`Survey ${createdSurvey.id} créé avec succès`);
    }
  }

main()
  .then(() => {
    console.log('Seeding terminé');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
