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
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\ExistsFilter;

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
 *  "secondLoadingWarehouse": "exact",
 *  "secondDeliveryWarehouse": "exact",
 * })
 * @ApiFilter(ExistsFilter::class, properties={"secondLoadingWarehouse", "secondDeliveryWarehouse"})
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
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="ratesFirstLoadings")
     */
    private $firstLoadingWarehouse;

    /**
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="ratesFirstDeliveries")
     */
    private $firstDeliveryWarehouse;

    /**
     * @ORM\ManyToOne(targetEntity=Carrier::class, inversedBy="rates")
     */
    private $carrier;

    /**
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="ratesSecondLoadings")
     */
    private $secondLoadingWarehouse;

    /**
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="ratesSecondDeliveries")
     */
    private $secondDeliveryWarehouse;

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

    public function getSecondLoadingWarehouse(): ?Warehouse
    {
        return $this->secondLoadingWarehouse;
    }

    public function setSecondLoadingWarehouse(?Warehouse $secondLoadingWarehouse): self
    {
        $this->secondLoadingWarehouse = $secondLoadingWarehouse;

        return $this;
    }

    public function getSecondDeliveryWarehouse(): ?Warehouse
    {
        return $this->secondDeliveryWarehouse;
    }

    public function setSecondDeliveryWarehouse(?Warehouse $secondDeliveryWarehouse): self
    {
        $this->secondDeliveryWarehouse = $secondDeliveryWarehouse;

        return $this;
    }
}
