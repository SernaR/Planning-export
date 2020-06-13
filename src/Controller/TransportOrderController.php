<?php

namespace App\Controller;


use App\Repository\CountryRepository;
use App\Repository\VehicleRepository;
use App\Repository\WarehouseRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TransportOrderController extends AbstractController
{
    /**
     * @Route("/transport/order", name="transport_order")
     */
    public function index()
    {
        return $this->render('transport_order/index.html.twig', [
            'controller_name' => 'TransportOrderController',
        ]);
    }

    /**
     * @Route("/transport/order/new", name="transport_order_new")
     *
     */
    public function new()
    {
        return $this->render('transport_order/new.html.twig', []);
    }
    
}
