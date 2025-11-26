import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Reservation } from '../types';

interface ReservationPDFData {
  reservation: Reservation;
  userName: string;
}

export const generateReservationPDF = async ({ reservation, userName }: ReservationPDFData) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 28px;
            margin-bottom: 5px;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          
          .confirmation-code {
            background-color: #fff;
            color: #007AFF;
            padding: 15px;
            margin: 20px 30px;
            border-radius: 8px;
            text-align: center;
            border: 2px dashed #007AFF;
          }
          
          .confirmation-code h2 {
            font-size: 16px;
            color: #666;
            margin-bottom: 5px;
          }
          
          .confirmation-code .code {
            font-size: 24px;
            font-weight: bold;
            color: #007AFF;
          }
          
          .content {
            padding: 30px;
          }
          
          .section {
            margin-bottom: 25px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #007AFF;
          }
          
          .info-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }
          
          .info-row:last-child {
            border-bottom: none;
          }
          
          .info-label {
            font-weight: bold;
            color: #666;
            width: 140px;
            font-size: 14px;
          }
          
          .info-value {
            color: #1a1a1a;
            flex: 1;
            font-size: 14px;
          }
          
          .total-section {
            background-color: #f8f9fa;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            text-align: center;
          }
          
          .total-label {
            font-size: 16px;
            color: #666;
            margin-bottom: 5px;
          }
          
          .total-amount {
            font-size: 32px;
            font-weight: bold;
            color: #28a745;
          }
          
          .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .status-confirmed {
            background-color: #28a745;
            color: white;
          }
          
          .status-pending {
            background-color: #ffc107;
            color: #1a1a1a;
          }
          
          .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #eee;
          }
          
          .footer p {
            font-size: 12px;
            color: #666;
            margin: 5px 0;
          }
          
          .footer .unab {
            font-weight: bold;
            color: #007AFF;
            font-size: 14px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Reserva Confirmada</h1>
            <p>Comprobante de Reserva</p>
          </div>
          
          <div class="confirmation-code">
            <h2>Código de Confirmación</h2>
            <div class="code">#${reservation.id}</div>
          </div>
          
          <div class="content">
            <div class="section">
              <h3 class="section-title">📍 Información de la Cancha</h3>
              <div class="info-row">
                <span class="info-label">Cancha:</span>
                <span class="info-value">${reservation.court?.name || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Deporte:</span>
                <span class="info-value">${reservation.court?.sport || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Capacidad:</span>
                <span class="info-value">${reservation.court?.capacity || 'N/A'} personas</span>
              </div>
            </div>
            
            <div class="section">
              <h3 class="section-title">📅 Fecha y Hora</h3>
              <div class="info-row">
                <span class="info-label">Fecha:</span>
                <span class="info-value">${formatDate(reservation.date)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Hora:</span>
                <span class="info-value">${formatTime(reservation.time)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Duración:</span>
                <span class="info-value">${reservation.duration || 60} minutos</span>
              </div>
            </div>
            
            <div class="section">
              <h3 class="section-title">👤 Información del Usuario</h3>
              <div class="info-row">
                <span class="info-label">Nombre:</span>
                <span class="info-value">${userName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${reservation.user?.email || 'N/A'}</span>
              </div>
            </div>
            
            <div class="section">
              <h3 class="section-title">📋 Estado de la Reserva</h3>
              <div class="info-row">
                <span class="info-label">Estado:</span>
                <span class="info-value">
                  <span class="status-badge status-${reservation.status}">
                    ${reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </span>
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Creada:</span>
                <span class="info-value">${new Date(reservation.created_at).toLocaleString('es-CL')}</span>
              </div>
            </div>
            
            ${reservation.notes ? `
              <div class="section">
                <h3 class="section-title">📝 Notas</h3>
                <div class="info-row">
                  <span class="info-value">${reservation.notes}</span>
                </div>
              </div>
            ` : ''}
            
            <div class="total-section">
              <div class="total-label">Total Pagado</div>
              <div class="total-amount">$${reservation.total_price.toLocaleString('es-CL')}</div>
            </div>
          </div>
          
          <div class="footer">
            <div class="unab">Universidad Andrés Bello (UNAB)</div>
            <p>Sistema de Reserva de Canchas Deportivas</p>
            <p>Este comprobante es válido como confirmación de tu reserva</p>
            <p>Conserva este documento para presentarlo el día de tu reserva</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};

export const sharePDF = async (pdfUri: string) => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(pdfUri);
    } else {
      throw new Error('Compartir no está disponible en este dispositivo');
    }
  } catch (error) {
    console.error('Error compartiendo PDF:', error);
    throw error;
  }
};

// La función downloadPDF simplemente llama a sharePDF ya que en móvil
// compartir es la forma estándar de "descargar" archivos
export const downloadPDF = async (pdfUri: string) => {
  return sharePDF(pdfUri);
};
