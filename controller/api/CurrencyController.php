<?php
    class CurrencyController extends BaseController
    {
        protected function latestAction($queryParams)
        {
            $currencyModel = new CurrencyModel();
            $intSymbols = "*";

            if (isset($queryParams['symbols']) && $queryParams['symbols']) {
                $intSymbols = "`timestamp`, `" . str_replace(',', '`,`', $queryParams['symbols']) . "`";
            }

            $result = $currencyModel->getLatest($intSymbols);

            if (isset($queryParams['base']) && $queryParams['base']) {
                $baseValue = $currencyModel->getBase($queryParams['base']);

                foreach ($result as &$value) {
                    $value = ($value / $baseValue);
                }
            }

            return $result;
        }

        protected function historicalAction($queryParams)
        {
            $currencyModel = new CurrencyModel();
            $intSymbols = "*";

            if (isset($queryParams['symbols']) && $queryParams['symbols']) {
                $intSymbols = "`" . str_replace(',', '`,`', $queryParams['symbols']) . "`";
            }

            $results = $currencyModel->getHistorical($intSymbols);

            if (isset($queryParams['base']) && $queryParams['base']) {
                foreach ($results as &$result) {
                    $baseValue = $currencyModel->getBase($queryParams['base'], $result["timestamp"]);

                    foreach ($result as $key=>$value) {
                        if($key != "timestamp" && $key != "id") {
                            $result[$key] = ($value / $baseValue);
                        }
                    }
                }
            }

            return $results;
        }

        protected function yesterdayAction($queryParams)
        {
            $results = $this->historicalAction($queryParams)[0];
            unset($results["timestamp"]);
            unset($results["id"]);

            return $results;
        }

        protected function timestampAction($queryParams)
        {
            $currencyModel = new CurrencyModel();
            $results = $currencyModel->getTimestamp();
            return $results;
        }

        protected function currencyAction($queryParams)
        {
            $currencyModel = new CurrencyModel();
            $intSymbols = "*";

            if (isset($queryParams['symbols']) && $queryParams['symbols']) {
                $intSymbols = "`" . str_replace(',', '`,`', $queryParams['symbols']) . "`";
            }

            return $currencyModel->getCurrency($intSymbols);
        }
    }