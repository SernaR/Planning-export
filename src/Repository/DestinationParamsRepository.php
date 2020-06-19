<?php

namespace App\Repository;

use App\Entity\DestinationParams;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method DestinationParams|null find($id, $lockMode = null, $lockVersion = null)
 * @method DestinationParams|null findOneBy(array $criteria, array $orderBy = null)
 * @method DestinationParams[]    findAll()
 * @method DestinationParams[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DestinationParamsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DestinationParams::class);
    }

    // /**
    //  * @return DestinationParams[] Returns an array of DestinationParams objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?DestinationParams
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
