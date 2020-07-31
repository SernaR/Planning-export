<?php

namespace App\Entity;

use App\Repository\WarehouseRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;


/**
 * @ORM\Entity(repositoryClass=WarehouseRepository::class)
 * @ApiResource(
 *  collectionOperations={},
 *  itemOperations={"get"},
 * )
 */
class Warehouse
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"initial_params_read", "orders_read"})  
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"orders_read", "order_read", "initial_params_read"})
     */
    private $name;

    /**
     * @ORM\OneToOne(targetEntity=Adress::class, cascade={"persist", "remove"}, inversedBy="warehouse")
     * @Groups({"order_read"})
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
     * @ORM\OneToMany(targetEntity=TransportOrder::class, mappedBy="secondLoadingWarehouse")
     */
    private $secondLoadings;
    /**
     * @ORM\OneToMany(targetEntity=TransportOrder::class, mappedBy="secondDeliveryWarehouse")
     */
    private $secondDeliveries;
    
    /**
     * @ORM\OneToMany(targetEntity=Rate::class, mappedBy="firstLoadingWarehouse")
     */
    private $ratesFirstLoadings;
    /**
     * @ORM\OneToMany(targetEntity=Rate::class, mappedBy="firstDeliveryWarehouse")
     */
    private $ratesFirstDeliveries;
    /**
     * @ORM\OneToMany(targetEntity=Rate::class, mappedBy="secondLoadingWarehouse")
     */
    private $ratesSecondLoadings;
    /**
     * @ORM\OneToMany(targetEntity=Rate::class, mappedBy="secondDeliveryWarehouse")
     */
    private $ratesSecondDeliveries;
   
    /**
     * @ORM\ManyToOne(targetEntity=InitialParams::class, inversedBy="warehouses")
     */
    private $initialParams;

    /**
     * @ORM\ManyToOne(targetEntity=DestinationParams::class, inversedBy="warehouses")
     */
    private $destinationParams;

    public function __construct()
    {
        $this->firstLoadings = new ArrayCollection();
        $this->firstDeliveries = new ArrayCollection();
        $this->rates = new ArrayCollection();
        $this->transportOrders = new ArrayCollection();
        $this->secondDeliveryWarehouse = new ArrayCollection();
        $this->secondDeliveryWarehousePlop = new ArrayCollection();
    }

    public function __toString()
    {
        if(is_null($this->name)) {
            return 'NULL';
        }
        return $this->name;
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

    public function getInitialParams(): ?InitialParams
    {
        return $this->initialParams;
    }

    public function setInitialParams(?InitialParams $initialParams): self
    {
        $this->initialParams = $initialParams;

        return $this;
    }

    public function getDestinationParams(): ?DestinationParams
    {
        return $this->destinationParams;
    }

    public function setDestinationParams(?DestinationParams $destinationParams): self
    {
        $this->destinationParams = $destinationParams;

        return $this;
    }

    /**
     * @return Collection|Rate[]
     */
    public function getRatesFirstLoadings(): Collection
    {
        return $this->ratesFirstLoadings;
    }

    public function addRatesFirstLoadings(Rate $ratesFirstLoading): self
    {
        if (!$this->ratesFirstLoadings->contains($ratesFirstLoading)) {
            $this->ratesFirstLoadings[] = $ratesFirstLoading;
            $ratesFirstLoading->setFirstLoadingWarehouse($this);
        }

        return $this;
    }

    public function removeRatesFirstLoading(Rate $ratesFirstLoading): self
    {
        if ($this->ratesFirstLoadings->contains($ratesFirstLoading)) {
            $this->ratesFirstLoadings->removeElement($ratesFirstLoading);
            // set the owning side to null (unless already changed)
            if ($ratesFirstLoading->getFirstLoadingWarehouse() === $this) {
                $ratesFirstLoading->setFirstLoadingWarehouse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Rate[]
     */
    public function getRatesSecondLoadings(): Collection
    {
        return $this->ratesSecondLoadings;
    }

    public function addRatesSecondLoadings(Rate $ratesSecondLoading): self
    {
        if (!$this->ratesSecondLoadings->contains($ratesSecondLoading)) {
            $this->ratesSecondLoadings[] = $ratesSecondLoading;
            $ratesSecondLoading->setSecondLoadingWarehouse($this);
        }

        return $this;
    }

    public function removeRatesSecondLoading(Rate $ratesSecondLoading): self
    {
        if ($this->ratesSecondLoadings->contains($ratesSecondLoading)) {
            $this->ratesSecondLoadings->removeElement($ratesSecondLoading);
            // set the owning side to null (unless already changed)
            if ($ratesSecondLoading->getSecondLoadingWarehouse() === $this) {
                $ratesSecondLoading->setSecondLoadingWarehouse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Rate[]
     */
    public function getRatesFirstDeliveries(): Collection
    {
        return $this->ratesFirstDeliveries;
    }

    public function addRatesFirstDeliveries(Rate $ratesFirstDelivery): self
    {
        if (!$this->ratesFirstDeliveries->contains($ratesFirstDelivery)) {
            $this->ratesFirstDeliveries[] = $ratesFirstDelivery;
            $ratesFirstDelivery->setFirstDeliveryWarehouse($this);
        }

        return $this;
    }

    public function removeRatesFirstDelivery(Rate $ratesFirstDelivery): self
    {
        if ($this->ratesFirstDeliveries->contains($ratesFirstDelivery)) {
            $this->ratesFirstDeliveries->removeElement($ratesFirstDelivery);
            // set the owning side to null (unless already changed)
            if ($ratesFirstDelivery->getFirstDeliveryWarehouse() === $this) {
                $ratesFirstDelivery->setFirstDeliveryWarehouse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Rate[]
     */
    public function getRatesSecondDeliveries(): Collection
    {
        return $this->ratesSecondDeliveries;
    }

    public function addRatesSecondDeliveries(Rate $ratesSecondDelivery): self
    {
        if (!$this->ratesSecondDeliveries->contains($ratesSecondDelivery)) {
            $this->ratesSecondDeliveries[] = $ratesSecondDelivery;
            $ratesSecondDelivery->setSecondDeliveryWarehouse($this);
        }

        return $this;
    }

    public function removeRatesSecondDelivery(Rate $ratesSecondDelivery): self
    {
        if ($this->ratesSecondDeliveries->contains($ratesSecondDelivery)) {
            $this->ratesSecondDeliveries->removeElement($ratesSecondDelivery);
            // set the owning side to null (unless already changed)
            if ($ratesSecondDelivery->getSecondDeliveryWarehouse() === $this) {
                $ratesSecondDelivery->setSecondDeliveryWarehouse(null);
            }
        }

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

    /**
     * @return Collection|TransportOrder[]
     */
    public function getSecondLoadings(): Collection
    {
        return $this->secondLoadings;
    }

    public function addSecondLoadings(TransportOrder $secondLoading): self
    {
        if (!$this->secondLoadings->contains($secondLoading)) {
            $this->secondLoadings[] = $secondLoading;
            $secondLoading->setSecondLoadingWarehouse($this);
        }

        return $this;
    }

    public function removeSecondLoading(TransportOrder $secondLoading): self
    {
        if ($this->secondLoadings->contains($secondLoading)) {
            $this->secondLoadings->removeElement($secondLoading);
            // set the owning side to null (unless already changed)
            if ($secondLoading->getSecondLoadingWarehouse() === $this) {
                $secondLoading->setSecondLoadingWarehouse(null);
            }
        }

        return $this;
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
     * @return Collection|TransportOrder[]
     */
    public function getSecondDeliveries(): Collection
    {
        return $this->secondDeliveries;
    }

    public function addSecondDelivery(TransportOrder $secondDelivery): self
    {
        if (!$this->secondDeliveries->contains($secondDelivery)) {
            $this->secondDeliveries[] = $secondDelivery;
            $secondDelivery->setSecondDeliveryWarehouse($this);
        }

        return $this;
    }

    public function removeSecondDelivery(TransportOrder $secondDelivery): self
    {
        if ($this->secondDeliveries->contains($secondDelivery)) {
            $this->secondDeliveries->removeElement($secondDelivery);
            // set the owning side to null (unless already changed)
            if ($secondDelivery->getSecondDeliveryWarehouse() === $this) {
                $secondDelivery->setSecondDeliveryWarehouse(null);
            }
        }

        return $this;
    }

}
