<?php

namespace App\Controller;

use App\Entity\OrderSearch;
use App\Form\OrderFilterType;
use Knp\Component\Pager\PaginatorInterface;
use App\Repository\TransportOrderRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TransportOrderController extends AbstractController
{
    /**
     * @Route("/transport/order/list", name="transport_order_list")
     */
    public function index(Request $request, TransportOrderRepository $transportOrderRepository, PaginatorInterface $paginator)
    {
    
        $search = new OrderSearch();
        $form = $this->createForm(OrderFilterType::class, $search);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
            //$code = $form['code']->getData();
            $data = $transportOrderRepository->findAllFiltered($search);
        } else {
            $data = $transportOrderRepository->findAll();
            
        }

        $orders = $paginator->paginate(
            $data,
            $request->query->getInt('page', 1),
            15
        );

        return $this->render('transport_order/index.html.twig', [
            'orders' => $orders,
            'form' => $form->createView(),
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
