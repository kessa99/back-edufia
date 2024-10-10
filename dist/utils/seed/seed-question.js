"use strict";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// const questions = [
//   {
//     text: "À quelle fréquence discutez-vous de vos finances ?",
//     options: [
//       { text: "Jamais" },
//       { text: "Une fois par mois" },
//       { text: "Une fois par semaine" },
//       { text: "Plusieurs fois par semaine" },
//     ],
//   },
//   {
//     text: "Vous sentez-vous à l’aise pour parler de vos préoccupations financières ?",
//     options: [
//       { text: "Oui, toujours" },
//       { text: "Parfois" },
//       { text: "Rarement" },
//       { text: "Non, jamais" },
//     ],
//   },
//   {
//     text: "Avez-vous des objectifs financiers communs (économiser pour une maison, des vacances, etc.) ?",
//     options: [
//       { text: "Oui, clairement définis" },
//       { text: "Oui, mais pas clairement définis" },
//       { text: "Non, nous n’en avons pas" },
//     ],
//   },
//   {
//     text: "Avez-vous discuté des étapes pour atteindre ces objectifs ?",
//     options: [
//       { text: "Oui, en détail" },
//       { text: "Oui, mais rapidement" },
//       { text: "Non, pas encore" },
//     ],
//   },
//   {
//     text: "Avez-vous un budget mensuel que vous suivez ensemble ?",
//     options: [
//       { text: "Oui, nous le respectons" },
//       { text: "Oui, mais pas toujours" },
//       { text: "Non, nous n’avons pas de budget" },
//     ],
//   },
//   {
//     text: "Qui gère le budget dans votre couple ?",
//     options: [
//       { text: "Un seul partenaire" },
//       { text: "Les deux partenaires ensemble" },
//       { text: "Nous n’avons pas de responsable" },
//     ],
//   },
//   {
//     text: "Comment décidez-vous des grosses dépenses (meubles, vacances, etc.) ?",
//     options: [
//       { text: "Nous en discutons toujours ensemble" },
//       { text: "L’un de nous prend souvent la décision" },
//       { text: "Nous ne discutons pas vraiment des grosses dépenses" },
//     ],
//   },
//   {
//     text: "Y a-t-il des dépenses non planifiées qui causent des tensions ?",
//     options: [
//       { text: "Oui, souvent" },
//       { text: "Parfois" },
//       { text: "Rarement" },
//       { text: "Non, jamais" },
//     ],
//   },
//   {
//     text: "Épargnez-vous régulièrement en tant que couple ?",
//     options: [
//       { text: "Oui, chaque mois" },
//       { text: "Oui, mais pas régulièrement" },
//       { text: "Non, nous ne mettons pas d'argent de côté" },
//     ],
//   },
//   {
//     text: "Avez-vous des investissements ?",
//     options: [
//       { text: "Oui, nous avons des investissements" },
//       { text: "Oui, mais nous n'avons pas encore commencé" },
//       { text: "Non, nous n'en avons pas discuté" },
//     ],
//   },
//   {
//     text: "Avez-vous des dettes en tant que couple (prêts, cartes de crédit, etc.)?",
//     options: [
//       { text: "Oui, beaucoup" },
//       { text: "Oui, quelques-unes" },
//       { text: "Non, pas de dettes" },
//     ],
//   },
//   {
//     text: "Comment gérez-vous vos dettes ensemble ?",
//     options: [
//       { text: "Nous avons un plan clair" },
//       { text: "Nous avons un plan vague" },
//       { text: "Nous ne savons pas comment gérer nos dettes" },
//     ],
//   },
// ];
// async function main() {
//   for (const question of questions) {
//     const createdQuestion = await prisma.question.create({
//       data: {
//         text: question.text,
//         options: {
//           create: question.options.map(option => ({ text: option.text })),
//         },
//       },
//     });
//     console.log(`Question ${createdQuestion.id} créée avec succès`);
//   }
// }
// main()
//   .then(() => {
//     console.log('Seeding terminé');
//     prisma.$disconnect();
//   })
//   .catch((e) => {
//     console.error(e);
//     prisma.$disconnect();
//     process.exit(1);
//   });
