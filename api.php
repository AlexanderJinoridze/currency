<?php
    require __DIR__ . "/inc/bootstrap.php";

    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode( '/', $uri );

    if (isset($uri[1]) && $uri[1] == 'api.php') {
        $baseController = new BaseController();
        if ((isset($uri[2]) && $uri[2] == 'currency') && isset($uri[3])) {
            require PROJECT_ROOT_PATH . "/Controller/Api/CurrencyController.php";
            $baseController->fetchAction($uri[3]. 'Action');
        }
    }
?>