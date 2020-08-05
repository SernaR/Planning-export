<?php

namespace App\Controller\Api;

use App\Entity\TransportOrder;
use App\Repository\TransportOrderRepository;

class OrderController 
{
    private $repo;

    public function __construct(TransportOrderRepository $transportOrderRepository)
    {
        $this->repo = $transportOrderRepository;
    }
    
    public function __invoke(TransportOrder $data)
    {
        $code = $this->repo->lastOrderCode() + 1;
        $country = $data->getFirstDeliveryWarehouse()->getAdress()->getCountry()->getCode();
        $data->setCode($country.$code);
        return $data;
    }
}