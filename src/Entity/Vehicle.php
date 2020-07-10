<?php

namespace App\Entity;

use App\Repository\VehicleRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ORM\Entity(repositoryClass=VehicleRepository::class)
 * @ApiResource(
 *  collectionOperations={},
 *  itemOperations={"get"},
 * )
 */
class Vehicle
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"initial_params_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"initial_params_read"})
     * @Groups({"orders_read", "order_read"})   
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=TransportOrder::class, mappedBy="vehicle")
     */
    private $transportOrders;

    /**
     * @ORM\ManyToOne(targetEntity=InitialParams::class, inversedBy="vehicles")
     */
    private $initialParams;

    public function __construct()
    {
        $this->transportOrders = new ArrayCollection();
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

    /**
     * @return Collection|TransportOrder[]
     */
    public function getTransportOrders(): Collection
    {
        return $this->transportOrders;
    }

    public function addTransportOrder(TransportOrder $transportOrder): self
    {
        if (!$this->transportOrders->contains($transportOrder)) {
            $this->transportOrders[] = $transportOrder;
            $transportOrder->setVehicle($this);
        }

        return $this;
    }

    public function removeTransportOrder(TransportOrder $transportOrder): self
    {
        if ($this->transportOrders->contains($transportOrder)) {
            $this->transportOrders->removeElement($transportOrder);
            // set the owning side to null (unless already changed)
            if ($transportOrder->getVehicle() === $this) {
                $transportOrder->setVehicle(null);
            }
        }

        return $this;
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
}
