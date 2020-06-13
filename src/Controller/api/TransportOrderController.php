<?php

namespace App\Controller\api;

use Error;
use App\Entity\Carrier;
use App\Entity\TransportOrder;
use App\Entity\Vehicle;
use App\Entity\Warehouse;
use App\Repository\CarrierRepository;
use App\Repository\CountryRepository;
use App\Repository\WarehouseRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\TransportOrderRepository;
use App\Repository\VehicleRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

/**
 * @Route("api")
 */
class TransportOrderController extends AbstractController
{
    /**
     * @Route("/params/init")
     */
    public function InitParams(CountryRepository $countryRepository, VehicleRepository $vehicleRepository, WarehouseRepository $warehouseRepository)
    {
        try {
            return $this->json([
            'countries' => $countryRepository->findCountryNames(),
            'vehicles' => $vehicleRepository->findVehicleNames(),
            'warehouses' => $warehouseRepository->findWarehouseByCountry(1) //à améliorer
            ], 200);
        } catch(Error $e) {
            return $this->json([
                'message' => $e->getMessage()
            ], 500);
        }        
    }

    /**
     * @Route("/params/init/{country}")
     */
    public function InitParamsByCountry(CarrierRepository $carrierRepository, WarehouseRepository $warehouseRepository, $country)
    {
        try {
            return $this->json([
                'carriers'   => $carrierRepository->findCarrierByCountry($country),
                'warehouses' => $warehouseRepository->findWarehouseByCountry($country)
            ], 200);
        }catch(Error $e) {
            return $this->json([
                'message' => $e->getMessage()
            ], 500);
        }    
    }

    /**
     * @Route("/order/create/{carrier}/{vehicle}/{firstLoadingWarehouse}/{firstDeliveryWarehouse}")
     * route avec 2 entrepots...
     * route avec 3 entrepots...
     */
    public function create(
        Request $request, 
        SerializerInterface $serializer, 
        EntityManagerInterface $em, //validator
        Carrier $carrier,
        Vehicle $vehicle,
        Warehouse $firstLoadingWarehouse,
        Warehouse $firstDeliveryWarehouse,
        TransportOrderRepository $transportOrderRepository) 
    {
        $json = $request->getContent();
        $code = $transportOrderRepository->lastOrderCode() + 1;

        try{
            $order = $serializer->deserialize($json, TransportOrder::class, 'json');
            $order->setCode($code);
            $order->setCarrier($carrier);
            $order->setVehicle($vehicle);
            $order->setFirstLoadingWarehouse($firstLoadingWarehouse);
            $order->setFirstDeliveryWarehouse($firstDeliveryWarehouse);
            $order->setCreatedAt(new \DateTime());
            $order->setUpdatedAt(new \DateTime());

            /*$errors = $validator->validate($order);
            if(count($errors) > 0) {
                return $this->json($errors, 400);
            }*/

            $em->persist($order);
            $em->flush();

            return $this->json([
                'status' => 201,
                'message' => 'order'.$order->getCode().' saved'
            ], 201);
            
        }catch(NotEncodableValueException $e) {
            return $this->json([
                'status' => 400,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
