<?php


session_start();


$data = file_get_contents("php://input");

// Decode data from js
$decoded = json_decode($data);


if ($decoded != null) {
} else {
    $function = $_GET["function"];
    if ($function == 'pay') {
        pay($_GET["item"]);
    }
}


function pay($item)
{
    require_once "mercadopago.php";

    $item_decoded = json_decode($item);


    $mp = new MP ("2825512066514146", "2KIKPJLtXNGBlRMLK2h3IY8WI6g8dfrB");
    $preference_data = array(
        "items" => array(
            array(
                "title" => $item_decoded->titulo,
                "currency_id" => "ARS",
                "category_id" => $item_decoded->categoria,
                "quantity" => intval($item_decoded->cantidad),
                "unit_price" => floatval($item_decoded->precio)
            )
        ),
        "payer" => array("email" => $item_decoded->mail)
    );
    $preference = $mp->create_preference($preference_data);
    echo json_encode($preference);
}

