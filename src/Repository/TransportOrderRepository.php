<?php

namespace App\Repository;

use App\Entity\OrderSearch;
use App\Entity\TransportOrder;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method TransportOrder|null find($id, $lockMode = null, $lockVersion = null)
 * @method TransportOrder|null findOneBy(array $criteria, array $orderBy = null)
 * @method TransportOrder[]    findAll()
 * @method TransportOrder[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TransportOrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TransportOrder::class);
    }

    public function lastOrderCode()
    {
        return $this->createQueryBuilder('t')
            ->select('count(t.id)')
            ->getQuery()
            ->getSingleScalarResult();
        ;    
    }

    public function findAllFiltered(OrderSearch $search) {

        $query = $this->createQueryBuilder('t')
            ->join('t.carrier', 'ca')
            ->join('t.firstDeliveryWarehouse', 'w')
            ->join('w.adress', 'a')
            ->join('a.country', 'c'); 

        if($search->getCode()) {
            $query = $query
                ->andWhere('t.code like :code')
                ->setParameter('code',  '%'.$search->getCode().'%');
        }

        if($search->getCountry()) {
            $query = $query
                ->andWhere('c.name like :country')
                ->setParameter('country',  '%'.$search->getCountry().'%');
        } 
        
        if($search->getCarrier()) {
            $query = $query
                ->andWhere('ca.name like :carrier')
                ->setParameter('carrier',  '%'.$search->getCarrier().'%');
        }
        return $query->getQuery();


    }

    // /**
    //  * @return TransportOrder[] Returns an array of TransportOrder objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?TransportOrder
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
