<?php

namespace App\Entity;

use App\Repository\WarehouseRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=WarehouseRepository::class)
 */
class Warehouse
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"orders_read"})
     */
    private $name;

    /**
     * @ORM\OneToOne(targetEntity=Adress::class, cascade={"persist", "remove"})
     * @Groups({"orders_read"})
     */
    private $adress;

    /**
     * @ORM\OneToMany(targetEntity=TransportOrder::class, mappedBy="firstLoadingWarehouse")
     */
    private $firstLoadings;

    /**
     * @ORM\OneToMany(targetEntity=TransportOrder::class, mappedBy="firstDeliveryWarehouse")
     */
    private $firstDeliveries;

    /**
     * @ORM\OneToMany(targetEntity=Rate::class, mappedBy="firstLoadingWarehouse")
     */
    private $rates;

    public function __construct()
    {
        $this->firstLoadings = new ArrayCollection();
        $this->firstDeliveries = new ArrayCollection();
        $this->rates = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|TransportOrder[]
     */
    public function getFirstLoadings(): Collection
    {
        return $this->firstLoadings;
    }

    public function addFirstLoadings(TransportOrder $firstLoading): self
    {
        if (!$this->firstLoadings->contains($firstLoading)) {
            $this->firstLoadings[] = $firstLoading;
            $firstLoading->setFirstLoadingWarehouse($this);
        }

        return $this;
    }

    public function removeFirstLoading(TransportOrder $firstLoading): self
    {
        if ($this->firstLoadings->contains($firstLoading)) {
            $this->firstLoadings->removeElement($firstLoading);
            // set the owning side to null (unless already changed)
            if ($firstLoading->getFirstLoadingWarehouse() === $this) {
                $firstLoading->setFirstLoadingWarehouse(null);
            }
        }

        return $this;
    }

    public function getAdress(): ?Adress
    {
        return $this->adress;
    }

    public function setAdress(?Adress $adress): self
    {
        $this->adress = $adress;

        return $this;
    }

    public function country() {
        return $this->adress ? $this->adress->getCountry()->getName() : 'Aucun';
    }

    /**
     * @return Collection|TransportOrder[]
     */
    public function getFirstDeliveries(): Collection
    {
        return $this->firstDeliveries;
    }

    public function addFirstDelivery(TransportOrder $firstDelivery): self
    {
        if (!$this->firstDeliveries->contains($firstDelivery)) {
            $this->firstDeliveries[] = $firstDelivery;
            $firstDelivery->setFirstDeliveryWarehouse($this);
        }

        return $this;
    }

    public function removeFirstDelivery(TransportOrder $firstDelivery): self
    {
        if ($this->firstDeliveries->contains($firstDelivery)) {
            $this->firstDeliveries->removeElement($firstDelivery);
            // set the owning side to null (unless already changed)
            if ($firstDelivery->getFirstDeliveryWarehouse() === $this) {
                $firstDelivery->setFirstDeliveryWarehouse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Rate[]
     */
    public function getRates(): Collection
    {
        return $this->rates;
    }

    public function addRate(Rate $rate): self
    {
        if (!$this->rates->contains($rate)) {
            $this->rates[] = $rate;
            $rate->setFirstLoadingWarehouse($this);
        }

        return $this;
    }

    public function removeRate(Rate $rate): self
    {
        if ($this->rates->contains($rate)) {
            $this->rates->removeElement($rate);
            // set the owning side to null (unless already changed)
            if ($rate->getFirstLoadingWarehouse() === $this) {
                $rate->setFirstLoadingWarehouse(null);
            }
        }

        return $this;
    }
}
