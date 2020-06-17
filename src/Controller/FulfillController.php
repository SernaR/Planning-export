<?php

namespace App\Controller;

use App\Entity\TransportOrder;
use App\Form\FulfilledOrderType;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\TransportOrderRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class FulfillController extends AbstractController
{
    /**
     * @Route("/fulfill", name="fulfill")
     */
    public function index(TransportOrderRepository $repo)
    {
        return $this->render('fulfill/index.html.twig', [
            'orders' => $repo->findBy([
                'volume' => null,
                'weight' => null
            ],[
                'firstLoadingStart' => 'asc'
            ])
        ]);
    }

    /**
     * @Route("/fulfill/{order}", name="fulfill_order")
     */
    public function fulfill($order)
    {
        return $this->render('fulfill/order.html.twig', [
            'order' => $order,
        ]);
    }
}
