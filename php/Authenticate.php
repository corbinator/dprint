
<?php
/**
 * Created by PhpStorm.
 * User: camer_000
 * Date: 11/3/14
 * Time: 12:07 PM
 */

if ( $_SERVER['REQUEST_METHOD'] == 'POST' && strpos($_SERVER['CONTENT_TYPE'], 'application/json') === 0 ) {
    $postdata = file_get_contents('php://input');
    $_POST = json_decode($postdata, true);
    $_REQUEST = array_merge($_REQUEST, $_POST);
}


$data = array();
$form = $_POST['form'];
$pass = $form['pass'];


if($pass == "p"){
    $data['success'] = true;
}
else{
    $data['success'] = false;
}


echo json_encode($data);


?>
