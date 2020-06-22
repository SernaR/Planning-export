<?php

namespace App\Controller\Api;

use App\Entity\TransportOrder;
use App\Repository\TransportOrderRepository;

class OrderController
{
    private $code;

    public function __construct(TransportOrderRepository $transportOrderRepository)
    {
        $this->code = $transportOrderRepository->lastOrderCode() + 1;
    }
    public function __invoke(TransportOrder $data)
    {
        $country = $data->getFirstDeliveryWarehouse()->getAdress()->getCountry()->getCode();
        $data->setCode($country.$this->code);
        return $data;
    }
}