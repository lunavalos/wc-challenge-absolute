import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, champion, runnerUp, thirdPlace, finalScore, topScorer, imageData } = body;

    if (!fullName || !champion || !runnerUp || !thirdPlace || !finalScore || !topScorer) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 }
      );
    }

    // SMTP configuration check
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    const recipientEmail = 'contacto@lunavalos.com';

    console.log(`[API Predict] Recibiendo predicción de ${fullName}:`);
    console.log(`- Campeón: ${champion}`);
    console.log(`- Subcampeón: ${runnerUp}`);
    console.log(`- Tercer Lugar: ${thirdPlace}`);
    console.log(`- Marcador Final: ${finalScore}`);
    console.log(`- Goleador del torneo: ${topScorer}`);

    const emailSubject = `Absolute World Cup Challenge - Predicción de ${fullName}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0b1329; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; margin-top: 0;">
          Absolute World Cup Challenge 🏆
        </h2>
        <p>Se ha recibido una nueva predicción para la dinámica de Absolute Group.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 40%;">Nombre Completo:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Campeón:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${champion}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Subcampeón:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${runnerUp}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Tercer Lugar:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${thirdPlace}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Marcador Final:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${finalScore}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Goleador del torneo:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${topScorer}</td>
          </tr>
        </table>
        
        <p style="color: #64748b; font-size: 0.875rem; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          Se adjunta la imagen con la tarjeta de predicciones generada automáticamente.
        </p>
      </div>
    `;

    // If SMTP credentials are not set, log to console and simulate success
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn(
        '⚠️ SMTP_HOST, SMTP_USER, o SMTP_PASSWORD no están configurados en las variables de entorno. La predicción se ha impreso en la consola.'
      );
      return NextResponse.json({
        success: true,
        message: 'Predicción registrada localmente en la consola (SMTP no configurado).',
        simulated: true,
      });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465, // true for 465, false for others
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const attachments = [];
    if (imageData && imageData.startsWith('data:image/')) {
      const base64Data = imageData.split(';base64,').pop();
      const filename = `quiniela-${fullName.replace(/\s+/g, '-').toLowerCase()}.png`;
      attachments.push({
        filename,
        content: base64Data,
        encoding: 'base64',
      });
    }

    // Send email
    await transporter.sendMail({
      from: `"Absolute World Cup Challenge" <${smtpUser}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
      attachments,
    });

    return NextResponse.json({
      success: true,
      message: 'Predicción enviada exitosamente por correo.',
    });
  } catch (error) {
    console.error('Error enviando predicción:', error);
    return NextResponse.json(
      { error: `Ocurrió un error al procesar el envío: ${error.message}` },
      { status: 500 }
    );
  }
}
