const nodemailer = require('nodemailer');
const { oAuth2Client } = require('../../google/oauth2');
const { google } = require('googleapis');
const moment = require('moment-timezone');
const { gmail, password } = require('../../config');

const sendToEmailIfSuccess = async (booking) => {
  try {
    // Penyesuaian waktu berdasarkan zona waktu
    booking.startDate = moment(booking.startDate).subtract(7, 'hours').format();
    booking.endDate = moment(booking.endDate).subtract(7, 'hours').format();

    // Konfigurasi transportasi email
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmail,
        pass: password,
      },
    });

    // Opsi email
    const mailOptions = {
      from: gmail,
      to: booking.email,
      subject: "Booking 7Seven",
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              width: 80%;
              margin: auto;
              background-color: #f9f9f9;
            }
            h1 {
              color: #0056b3;
            }
            p {
              font-size: 16px;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              margin-bottom: 10px;
            }
            .highlight {
              font-weight: bold;
              color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Booking Berhasil</h1>
            <p>Terima kasih telah melakukan booking meja billiard di 7Seven.</p>
            <p>Detail Booking Anda:</p>
            <ul>
              <li><span class="highlight">Tanggal Mulai:</span> ${new Date(booking.startDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</li>
              <li><span class="highlight">Tanggal Selesai:</span> ${new Date(booking.endDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</li>
              <li><span class="highlight">Durasi:</span> ${booking.duration} jam</li>
              <li><span class="highlight">Total Pembayaran:</span> Rp ${booking.total.toLocaleString('id-ID')}</li>
              <li><span class="highlight">Lokasi:</span> <a href="https://maps.app.goo.gl/c3XBmewaoUypohQq7">Billiard 7Seven, Medan, Indonesia</a></li>
            </ul>
            <p>Untuk informasi lebih lanjut, silakan hubungi kami.</p>
          </div>
        </body>
        </html>
      `,
    };

    // Mengirim email
    await new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info);
        }
      });
    });

  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const createEvent = async (auth, booking) => {
  try {

    const adjustedStartDate = moment(booking.startDate).add(5, 'hours').format();
    const adjustedEndDate = moment(booking.endDate).add(5, 'hours').format();
    console.log(booking.startDate)
    console.log(adjustedStartDate)

    const calendar = google.calendar({ version: 'v3', auth });
    const event = {
      summary: 'Booking Meja Billiard',
      location: 'Lokasi Billiard 7Seven',
      description: `Pemesanan meja billiard untuk bermain selama ${booking.duration} jam \n\n Lokasi: https://maps.app.goo.gl/c3XBmewaoUypohQq7`,
      start: {
        dateTime: adjustedStartDate,
        timeZone: 'Asia/Jakarta',
      },
      end: {
        dateTime: adjustedEndDate,
        timeZone: 'Asia/Jakarta',
      },
      attendees: [{ email: booking.email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 30 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    await new Promise((resolve, reject) => {
      calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      }, (err, event) => {
        if (err) {
          reject('There was an error contacting the Calendar service: ' + err);
        } else {
          console.log('Event created: %s', event.data.htmlLink);
          resolve(event);
        }
      });
    });
  } catch (error) {
    console.error('Error creating event:', error);
  }
};

const sendToEmailIfError = async (booking) => {
  try {
    // Penyesuaian waktu berdasarkan zona waktu
    booking.startDate = moment(booking.startDate).subtract(7, 'hours').format();
    booking.endDate = moment(booking.endDate).subtract(7, 'hours').format();

    // Konfigurasi transportasi email
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmail,
        pass: password,
      },
    });

    // Opsi email
    const mailOptions = {
      from: gmail,
      to: booking.email,
      subject: "Booking 7Seven",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff3f3;
          }
          .container {
            padding: 20px;
            border: 1px solid #f44336;
            border-radius: 5px;
            width: 80%;
            margin: auto;
            background-color: #ffebee;
          }
          h1 {
            color: #d32f2f;
          }
          p {
            font-size: 16px;
            color: #b71c1c;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin-bottom: 10px;
          }
          .highlight {
            font-weight: bold;
            color: #d32f2f;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Booking Ditolak</h1>
          <p>Mohon maaf, booking meja billiard Anda di 7Seven telah ditolak.</p>
          <p>Detail Booking Anda:</p>
          <ul>
            <li><span class="highlight">Tanggal Mulai:</span> ${new Date(booking.startDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</li>
            <li><span class="highlight">Tanggal Selesai:</span> ${new Date(booking.endDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</li>
            <li><span class="highlight">Durasi:</span> ${booking.duration} jam</li>
            <li><span class="highlight">Total Pembayaran:</span> Rp ${booking.total.toLocaleString('id-ID')}</li>
            <li><span class="highlight">Lokasi:</span> <a href="https://maps.app.goo.gl/c3XBmewaoUypohQq7">Billiard 7Seven, Medan, Indonesia</a></li>
          </ul>
          <p>Silahkan mengirim ulang bukti pembayaran.</p>
        </div>
      </body>
      </html>      
      `,
    };

    // Mengirim email
    await new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info);
        }
      });
    });

  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendToEmailIfSuccess,
  sendToEmailIfError,
  createEvent
};
