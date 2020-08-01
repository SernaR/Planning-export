<?php

namespace App\Entity;

use App\Repository\CarrierRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ORM\Entity(repositoryClass=CarrierRepository::class)
 * @ApiResource(
 *  collectionOperations={},
 *  itemOperations={"get"},
 * )
 */
class Carrier
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
     * @Groups({"orders_read", "order_read", "initial_params_read"})
     * 
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $contact;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"order_read"})
     */
    private $telephone;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *  @Groups({"order_read"})
     */
    private $email;

    /**
     * @ORM\OneToMany(targetEntity=TransportOrder::class, mappedBy="carrier")
     */
    private $transportOrders;

    /**
     * @ORM\OneToOne(targetEntity=Adress::class, cascade={"persist"})
     *  @Groups({"order_read"})
     */
    private $adress;

    /**
     * @ORM\OneToMany(targetEntity=Rate::class, mappedBy="carrier")
     */
    private $rates;

    /**
     * @ORM\ManyToMany(targetEntity=DestinationParams::class, mappedBy="carriers")
     */
    private $destinationParams;

    

    public function __construct()
    {
        $this->transportOrders = new ArrayCollection();
        $this->rates = new ArrayCollection();
        $this->destinationParams = new ArrayCollection();
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

    public function getContact(): ?string
    {
        return $this->contact;
    }

    public function setContact(string $contact): self
    {
        $this->contact = $contact;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): self
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

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
            $transportOrder->setCarrier($this);
        }

        return $this;
    }

    public function removeTransportOrder(TransportOrder $transportOrder): self
    {
        if ($this->transportOrders->contains($transportOrder)) {
            $this->transportOrders->removeElement($transportOrder);
            // set the owning side to null (unless already changed)
            if ($transportOrder->getCarrier() === $this) {
                $transportOrder->setCarrier(null);
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
            $rate->setCarrier($this);
        }

        return $this;
    }

    public function removeRate(Rate $rate): self
    {
        if ($this->rates->contains($rate)) {
            $this->rates->removeElement($rate);
            // set the owning side to null (unless already changed)
            if ($rate->getCarrier() === $this) {
                $rate->setCarrier(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|DestinationParams[]
     */
    public function getDestinationParams(): Collection
    {
        return $this->destinationParams;
    }

    public function addDestinationParam(DestinationParams $destinationParam): self
    {
        if (!$this->destinationParams->contains($destinationParam)) {
            $this->destinationParams[] = $destinationParam;
            $destinationParam->addCarrier($this);
        }

        return $this;
    }

    public function removeDestinationParam(DestinationParams $destinationParam): self
    {
        if ($this->destinationParams->contains($destinationParam)) {
            $this->destinationParams->removeElement($destinationParam);
            $destinationParam->removeCarrier($this);
        }

        return $this;
    }

    
}
