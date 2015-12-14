<?php
require_once "../../includes/config.php";
$foler = $_SERVER['DOCUMENT_ROOT'];
global $image_path;

if (isset($_FILES["folder"])) {
    $output_dir = $image_path . $_FILES["folder"];
} else {
    $output_dir = $image_path;
}

if (isset($_FILES["images"])) {
    $ret = array();

    $error = $_FILES["images"]["error"];
    //You need to handle  both cases
    //If Any browser does not support serializing of multiple files using FormData()
    if (!is_array($_FILES["images"]["name"])) //single file
    {
        $fileName = $_FILES["images"]["name"];
        move_uploaded_file($_FILES["images"]["tmp_name"], $output_dir . $fileName);
        $ret[] = $fileName;
    } else  //Multiple files, file[]
    {
        $fileCount = count($_FILES["images"]["name"]);
        for ($i = 0; $i < $fileCount; $i++) {
            $fileName = $_FILES["images"]["name"][$i];
            move_uploaded_file($_FILES["images"]["tmp_name"][$i], $output_dir . $fileName);
            $ret[] = $fileName;
        }

    }
    echo json_encode($ret);
}