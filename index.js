const sharp = require("sharp");
const express = require("express");
const app = express();
const port = 3000;
const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use(express.static("public"));

// Caminho para a imagem de modelo
const modeloImagePath = "./modeloAssinatura/modelo.png";

async function compositeImage(req, res) {
  //dados recebidos do usuario
  const nome = req.body.nome;
  const cargo = req.body.cargo;
  const perfilImageBuffer = req.files.perfil.data;
  console.log(perfilImageBuffer);

  const perfilAdaptado = await sharp(perfilImageBuffer)
    .resize(800)
    .png()
    .toBuffer();

  imageBuffer = await sharp(modeloImagePath)
    .composite([{ input: perfilAdaptado, left: 30, top: 100 }])
    .png()
    .toBuffer();

  const width = "1500px";
  const height = "660px";
  const svgText = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { fill: white; font-size: 99px; font-family: Ubuntu, sans-serif;margin-left:'520px;letter-spacing: 2px' }
        .sub-title { fill: #fab44c; font-size: 65px; font-family: Ubuntu, sans-serif;margin-left:'520px' }
    </style>
    <text x="150px" y="85px" class="title">${nome}</text>
    <text x="150px" y="151px"  class="sub-title">${cargo}</text>

  </svg>`;

  //const svgBuffer = Buffer.from(svgText);

  const finalImageBuffer = await sharp(imageBuffer)
    .composite([{ input: Buffer.from(svgText) }])
    .toBuffer();

  res.set("Content-Type", "image/jpeg"); // ou 'image/png'
  res.set("Content-Disposition", 'attachment; filename="imagem.jpg"'); // ou 'imagem.png' se for PNG
  res.send(finalImageBuffer);
}

app.post("/geraAssinatura", (req, res) => compositeImage(req, res));

app.listen(port, () => console.log(`Servidor de Assinatura rodando na  ${port}!`));
