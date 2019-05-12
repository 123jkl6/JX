const nodemailer = require('nodemailer');

function sendMail(textMail,attachments,recepients){
	
	var transporter = nodemailer.createTransport({
        host: process.env.host,
        port: process.env.port,
		auth: {
		    user: process.env.username,
		    pass: process.env.password,
		  }
		});

	var mailOptions = {
	  from: process.env.senderAddress,
	  to: recepients.toString(),
	  subject: 'Test Results',
	  text: textMail,
	  attachments:attachments,
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
}

module.exports = sendMail;