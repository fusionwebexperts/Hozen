<?php
// There are two possible settings for sending mail from your contact forms.
// First option is mail php function, which is easier to set up, but might not be delivered always or marked as spam (especialy when using low quality hosting providers)
// Second option is to use SMTP. This requires a bit more configuration, but it is much more reliable.
// To use SMTP change useSMTP to "true" and configure options under SMTP settings. If you chose first option, than you just need to set up your mail address and nothing else.

//EDIT SETTINGS HERE:
$useSMTP = false;
$yourmail = "your email goes here";
//SMTP settings
$smtpUsername ="your username goes here";
$smtpPassword ="your password goes here";
$smtpHost ="your SMTP server: (ie: smtp.gmail.com)";

//STOP editing (unless you know what you're doing)

$email = $_POST['email'];
$subject = $_POST['subject'] ;
$message = $_POST['message'];
$name = $_POST['name'];

require 'phpmailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

if($useSMTP) {
	$mail->isSMTP();
	$mail->SMTPDebug = 0;
	$mail->SMTPAuth	 = TRUE;
	$mail->SMTPSecure = "tls";
	$mail->Port     = 587;  
	$mail->Username = $smtpUsername;
	$mail->Password = $smtpPassword;
	$mail->Host     = $smtpHost;
}

// If you get emails sent to your spam folder, comment out the line below.
// This will force the mail function to use the server email / username,
// but emails should not go to the spam folder.

// Another solution is to allow the emails that appear in the spam folder and
// your email client should white list them (if sent from your server).
$mail->setFrom($email, $name);

$mail->addReplyTo($email, $name);
$mail->addAddress($yourmail);	
$mail->Subject = $subject ;
$mail->WordWrap   = 80;
$mail->msgHTML($message);
$mail->isHTML(true);

if(!$mail->send()) {
	echo "<p class='error'>Problem in Sending Mail.</p>";
} else {
	echo "<p class='success'>Contact Mail Sent.</p>";
}
?>