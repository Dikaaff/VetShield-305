const S = (text, category, difficulty, flags, rule, channel = "email") => ({
  text, category, difficulty, flags, rule, channel,
});

export const EN_SCAM = [
  S("URGENT: your account will be suspended today. Verify at {domain} or reply with your one-time code. Ref {ref}", "bank", "easy", ["Account suspension threat", "Asks for a one-time code", "Unusual link"], "Banks never ask for codes by message."),
  S("Your VA benefit payment is on hold. Confirm your identity at {domain} within 24 hours. Ref {ref}", "benefits", "easy", ["Claims to be an agency", "24-hour deadline", "Unusual link"], "Benefit status lives in your own account."),
  S("Congratulations, you have won {amount}. Pay the claim fee of $95 to {phone} today. Ref {ref}", "prize", "medium", ["Prize you did not enter", "Upfront fee"], "Real prizes never charge a fee."),
  S("Remote job, $300 daily pay, no experience needed. Send a $120 registration fee to start. Ref {ref}", "job", "easy", ["Easy money", "Upfront fee"], "Employers do not charge for jobs."),
  S("Your parcel is held at customs. Pay the {amount} redelivery fee at {domain} today. Ref {ref}", "delivery", "medium", ["Extra fee", "Short deadline", "Link"], "Carriers do not collect customs fees by text."),
  S("This is Microsoft Support. Your computer is infected. Install remote access software and give us the code. Ref {ref}", "tech_support", "easy", ["Remote access request", "Virus scare"], "Support never asks for remote access unprompted."),
  S("Guaranteed 30% monthly profit. Send {amount} in USDT to our wallet today. Ref {ref}", "investment", "easy", ["Guaranteed returns", "Crypto transfer"], "Guaranteed returns are a scam signal."),
  S("Hi grandma, I lost my phone. This is my new number. I need {amount} for a hospital bill, please do not call my old number. Ref {ref}", "family_emergency", "medium", ["New number story", "Money request", "Asks not to call"], "Call the old number before sending money."),
  S("Your tax refund of {amount} is waiting. Enter your SSN and bank details at {domain}. Ref {ref}", "tax", "medium", ["Refund offer", "Asks for SSN"], "Tax agencies never ask for SSN by link."),
  S("Hi, I overpaid you by {amount}. Please refund the difference to this account. Message me on Telegram. Ref {ref}", "marketplace", "medium", ["Overpayment story", "Moves to private chat"], "Overpayment is a classic marketplace trick."),
  S("Security alert: a new login was detected. Confirm your password at {domain} to avoid closure. Ref {ref}", "account_security", "hard", ["Asks for password", "Threatens closure"], "Passwords are only entered in the official app."),
  S("My love, I need {amount} for my child's surgery. Send it today and keep this between us. Ref {ref}", "romance", "medium", ["Money request", "Secrecy request"], "Money requests from online partners are a stop sign."),
];

export const EN_LEGIT = [
  S("A charge of {amount} was made on your card at {time}. If this was not you, call the number on the back of your card. We will never ask for your PIN or code. Ref {ref}", "bank", "hard", ["Unexpected charge", "Urgent tone"], "Real alerts point to the number on your card."),
  S("Your verification code is {code}. Never share this code with anyone. If you did not request it, ignore this message.", "account_security", "hard", ["Verification code", "Warns not to share"], "Real OTP messages warn you not to share."),
  S("Order #{ref} has shipped. Track it in our official app. No extra payment is needed. Ref {ref}", "delivery", "easy", ["Shipping status"], "Ordinary shipping notice."),
  S("Reminder: your tax return is due 15 April. Log in to the official tax website. We never request details by message. Ref {ref}", "tax", "medium", ["Deadline", "Official agency"], "Official reminder without a suspicious link."),
  S("Thank you for applying. Your interview is scheduled for {time} and details are in your applicant account. Ref {ref}", "job", "medium", ["Recruiting process"], "Interview details in the applicant account."),
  S("Your order is packed. The marketplace holds your payment until you confirm delivery. Ref {ref}", "marketplace", "easy", ["Order status"], "Platform payment protection."),
  S("You entered our customer draw and won a {amount} voucher. Claim it in the official app at no cost. Ref {ref}", "prize", "hard", ["Prize win", "No fee"], "Prize from a draw you entered."),
  S("Free veterans health screening on Saturday at 9am at the community hall. No registration needed. Ref {ref}", "benefits", "easy", ["Official service"], "Free service announcement."),
  S("New sign-in from a new device. If this was you, no action is needed. If not, change your password in the official app. Ref {ref}", "account_security", "medium", ["New login", "Password advice"], "Official security notice."),
];

export const ES_SCAM = [
  S("URGENTE: su cuenta será bloqueada hoy. Verifique en {domain} o envíe su código de verificación. Ref {ref}", "bank", "easy", ["Amenaza de bloqueo", "Pide código", "Enlace raro"], "El banco nunca pide códigos por mensaje."),
  S("Su paquete está retenido en aduana. Pague {amount} en {domain} hoy. Ref {ref}", "delivery", "medium", ["Cargo extra", "Enlace"], "Las aduanas no cobran por mensaje."),
  S("Felicitaciones, ganó {amount}. Pague la tarifa de reclamo de $95 hoy. Ref {ref}", "prize", "medium", ["Premio no solicitado", "Tarifa por adelantado"], "Los premios reales no cobran."),
  S("Trabajo desde casa, pago diario, sin experiencia. Envíe un depósito de {amount} para comenzar. Ref {ref}", "job", "easy", ["Dinero fácil", "Depósito"], "Un empleo real no cobra."),
  S("Soporte técnico: su computadora tiene un virus. Instale acceso remoto y deme el código. Ref {ref}", "tech_support", "easy", ["Acceso remoto", "Miedo a virus"], "El soporte no pide acceso remoto."),
  S("Mi amor, necesito {amount} para la operación de mi hijo. Envíelo hoy y no le diga a nadie. Ref {ref}", "romance", "medium", ["Pide dinero", "Pide secreto"], "Una petición de dinero es una señal de alto."),
  S("Su reembolso de impuestos de {amount} está listo. Ingrese su número de identificación en {domain}. Ref {ref}", "tax", "medium", ["Reembolso", "Pide identificación"], "La agencia fiscal no pide datos por enlace."),
  S("Abuela, perdí mi teléfono. Este es mi número nuevo. Necesito {amount} para el hospital, no llame al número viejo. Ref {ref}", "family_emergency", "medium", ["Número nuevo", "Pide dinero"], "Llame al número antiguo primero."),
];

export const ES_LEGIT = [
  S("Se realizó un cargo de {amount} en su tarjeta. Si no fue usted, llame al número del reverso de su tarjeta. Nunca le pediremos su PIN. Ref {ref}", "bank", "hard", ["Cargo inesperado"], "La alerta real remite al número de la tarjeta."),
  S("Su código de verificación es {code}. Nunca comparta este código. Si no lo solicitó, ignore este mensaje.", "account_security", "hard", ["Código de verificación"], "El código real advierte no compartirlo."),
  S("Su pedido #{ref} fue enviado. Siga el envío en la aplicación oficial. Sin costo adicional.", "delivery", "easy", ["Estado del pedido"], "Aviso de envío normal."),
  S("Recordatorio: la declaración de impuestos vence el 30 de abril. Ingrese al sitio oficial. No pedimos datos por mensaje. Ref {ref}", "tax", "medium", ["Fecha límite"], "Recordatorio oficial."),
  S("Su pedido está empacado. La plataforma retiene el pago hasta que confirme la entrega. Ref {ref}", "marketplace", "easy", ["Estado del pedido"], "Protección de pago de la plataforma."),
];
