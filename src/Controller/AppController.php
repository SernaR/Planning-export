<?php

namespace App\Controller;

use App\Repository\TransportOrderRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="app")
     */
    public function index(TransportOrderRepository $transportOrderRepository)
    {
        return $this->render('app/index.html.twig', [
            'orders' => $transportOrderRepository->findAll(),
        ]);
    }
}
