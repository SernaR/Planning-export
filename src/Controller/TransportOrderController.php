<?php

namespace App\Controller;

use App\Form\InitOrderType;
use App\Entity\TransportOrder;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TransportOrderController extends AbstractController
{
    private $em;
    
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }
    
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
     * @Route("/transport/order/new", name="transport_order_init")
     *
     */
    /*
    public function Init(Request $request)
    {
        $order = new TransportOrder();
        $form = $this->createForm(InitOrderType::class, $order);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($order);
            $this->em->flush();

            return $this->redirectToRoute('transport_order');
        }

        return $this->render('transport_order/init.html.twig', [
            'form' => $form->createView(),
        ]);
    }
    */
}
