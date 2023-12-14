import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', (req, res) => {
    // Envoyer le formulaire HTML
    res.sendFile('index.html');
  });
  
app.post('/sendmail', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    console.log(to);
    console.log(subject);
    console.Clog(text);
    return res.status(400).json({ error: 'Tous les champs du formulaire sont obligatoires.' });
  }

  try {
    // Configurer le transporteur pour utiliser un serveur SMTP
    const config = {
        host: "smtp.sendgrid.net",
        secure: false,
        auth: {
           user: "apikey",
           pass: process.env.SENDGRID_SECRET,
        },
        name: "dufullstack.fr",
     };
     console.log(config.auth.pass)
     const transporter = nodemailer.createTransport(config)
     const info =   await transporter.sendMail({ from:"buisson@n7.fr", to: to , subject, text })

    // Envoyer l'e-mail
    console.log('E-mail envoyé :', info.response);

    res.send( 'E-mail envoyé avec succès.' );
  } catch (error) {
    console.error('Erreur lors de l\'envoi du courrier :', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'envoi du courrier.' });
  }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
