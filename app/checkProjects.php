<?php
require_once 'includes/MyDBi.php';
require 'ac-angular-contacts/includes/PHPMailerAutoload.php';
$db = new MysqliDb();


$results = $db->rawQuery('select p.proyecto_id proyecto_id, p.nombre, u.nombre nombreUsuario, u.mail
from proyectos p left join usuarios u on p.usuario_id = u.usuario_id
where fecha_fin < now() and status =1;','',false);


foreach ($results as $row) {
    $data = array(
        'status' => 2
    );

    $db->where('proyecto_id', $row['proyecto_id']);
    $db->update('proyectos', $data);

    sendMail('arielcessario@gmail.com', $row['mail'], 'MPE', 'Su proyecto ' . $row['nombre'] . ' ha finalizado',
        $row['nombreUsuario'] . ' te informamos que tu proyecto ' . $row['nombre'] . ' ha finalizado');
}


function sendMail($mail_origen, $mails_destino, $nombre, $mensaje, $asunto)
{


    $mail = new PHPMailer;
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'ventas@ac-desarrollos.com';                 // SMTP username
    $mail->Password = 'ventas';                           // SMTP password
    $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 465;
    $mail->CharSet = 'UTF-8';
    $mail->From = $mail_origen;
    $mail->FromName = $nombre;
    $mail->addAddress($mails_destino);     // Add a recipient
    $mail->isHTML(true);                                  // Set email format to HTML

    $mail->Subject = $asunto;
    $mail->Body = $mensaje;
    $mail->AltBody = $mensaje;

    if (!$mail->send()) {
        echo 'Message could not be sent.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Message has been sent';
    }
}
