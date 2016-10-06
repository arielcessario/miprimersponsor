<?php
session_start();
/*
if (file_exists('../../../includes/MyDBi.php')) {
    require_once '../../../includes/MyDBi.php';
    //require_once '../../../includes/utils.php';
} else {
    require_once 'MyDBi.php';
}
*/

$data = file_get_contents("php://input");

$decoded = json_decode($data);
if ($decoded != null) {
    if ($decoded->function == 'create') {
        create($decoded->data);
    }
} else {
    /*
    $function = $_GET["function"];
    if ($function == 'getNoticias') {
        getNoticias();
    }
    */
}


function create($data){

    $decoded = json_decode($data);
    $donacion = $decoded->donacion;
    $item = $decoded->item;
    $usuario_id = $decoded->usuario_id;
    $mail = $decoded->mail;

    $file = 'mps_user_' . $usuario_id . '_' . date('Y-m-d') . '.log';
    $current = file_get_contents($file);
    $current .= date('Y-m-d H:i:s') . ": proyecto_id: " . $donacion->proyecto_id . "\n";
    $current .= ": usuario_id: " . $usuario_id . "\n";
    $current .= ": email: " . $mail . "\n";
    $current .= ": Proyecto: " . $item->titulo . "\n";
    $current .= ": donador_id: " . $donacion->donador_id . "\n";
    $current .= ": valor: " . $donacion->valor . "\n";
    $current .= ": categoria: " . $item->categoria . "\n";
    $current .= ": cantidad: " . $item->cantidad . "\n";
    $current .= ": precio: " . $item->precio . "\n";
    $current .= ": mail: " . $item->mail . "\n";
    $current .= "/***************************************************************************/\n";
    file_put_contents($file, $current);

    echo json_encode($data);

}