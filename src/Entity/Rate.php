<?php

namespace App\Entity;

use App\Repository\RateRepository;
//use Doctrine\Common\Collections\ArrayCollection;
//use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass=RateRepository::class)
 * @ApiResource(
 *  collectionOperations={"get"},
 *  itemOperations={"get"},
 *  normalizationContext={
 *      "groups"={"rate_read"}
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *  "carrier": "exact",
 *  "firstLoadingWarehouse": "exact",
 *  "firstDeliveryWarehouse": "exact",
 * })
 */
class Rate
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * 
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     *  @Groups({"rate_read"})
     */
    private $amount;

    /**
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="rates")
     */
    private $firstLoadingWarehouse;

    /**
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="rates")
     */
    private $firstDeliveryWarehouse;

    /**
     * @ORM\ManyToOne(targetEntity=Carrier::class, inversedBy="rates")
     */
    private $carrier;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getFirstLoadingWarehouse(): ?Warehouse
    {
        return $this->firstLoadingWarehouse;
    }

    public function setFirstLoadingWarehouse(?Warehouse $firstLoadingWarehouse): self
    {
        $this->firstLoadingWarehouse = $firstLoadingWarehouse;

        return $this;
    }

    public function getFirstDeliveryWarehouse(): ?Warehouse
    {
        return $this->firstDeliveryWarehouse;
    }

    public function setFirstDeliveryWarehouse(?Warehouse $firstDeliveryWarehouse): self
    {
        $this->firstDeliveryWarehouse = $firstDeliveryWarehouse;

        return $this;
    }

    public function getCarrier(): ?Carrier
    {
        return $this->carrier;
    }

    public function setCarrier(?Carrier $carrier): self
    {
        $this->carrier = $carrier;

        return $this;
    }
}