<?php

namespace App\Controller\Api;

use Error;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\TransportOrderRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("api")
 */
class FulfillController extends AbstractController
{
    /**
     * @Route("/order/find/{order}", methods={"GET"})
     * 
     */
    public function findOne(TransportOrderRepository $repo,  $order)
    {   
        try {
            return $this->json([
                'order' => $repo->findOneToFulfill($order),
            ], 200);
        }catch(Error $e) {
            return $this->json([
                'message' => $e->getMessage()
            ], 500);
        }  
    }

    public function update()
    {

    }

}