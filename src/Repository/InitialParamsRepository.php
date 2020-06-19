<?php

namespace App\Repository;

use App\Entity\InitialParams;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method InitialParams|null find($id, $lockMode = null, $lockVersion = null)
 * @method InitialParams|null findOneBy(array $criteria, array $orderBy = null)
 * @method InitialParams[]    findAll()
 * @method InitialParams[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InitialParamsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InitialParams::class);
    }

    // /**
    //  * @return InitialParams[] Returns an array of InitialParams objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?InitialParams
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
