const nodemailer = require('nodemailer');

function sendMail(textMail,recepients){
	
	var transporter = nodemailer.createTransport({
	    host: process.env.host,
	    port: process.env.port,
		auth: {
		    user: process.env.senderAddress,
		    pass: process.env.password
		  }
		});

	var mailOptions = {
	  from: process.env.senderAddress,
	  to: recepients.toString(),
	  subject: 'Test Results',
	  text: textMail
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