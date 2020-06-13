<?php

namespace App\Entity;

use App\Repository\CountryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CountryRepository::class)
 */
class Country
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $code;

    /**
     * @ORM\ManyToMany(targetEntity=Carrier::class, mappedBy="deliveryPlaces")
     */
    private $carriers;

    /**
     * @ORM\OneToMany(targetEntity=Adress::class, mappedBy="country")
     */
    private $adresses;

    public function __construct()
    {
        $this->carriers = new ArrayCollection();
        $this->adresses = new ArrayCollection();
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

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

   public function __toString()
   {
       return $this->name;
   }

   /**
    * @return Collection|Carrier[]
    */
   public function getCarriers(): Collection
   {
       return $this->carriers;
   }

   public function addCarrier(Carrier $carrier): self
   {
       if (!$this->carriers->contains($carrier)) {
           $this->carriers[] = $carrier;
           $carrier->addDeliveryPlace($this);
       }

       return $this;
   }

   public function removeCarrier(Carrier $carrier): self
   {
       if ($this->carriers->contains($carrier)) {
           $this->carriers->removeElement($carrier);
           $carrier->removeDeliveryPlace($this);
       }

       return $this;
   }

   /**
    * @return Collection|Adress[]
    */
   public function getAdresses(): Collection
   {
       return $this->adresses;
   }

   public function addAdress(Adress $adress): self
   {
       if (!$this->adresses->contains($adress)) {
           $this->adresses[] = $adress;
           $adress->setCountry($this);
       }

       return $this;
   }

   public function removeAdress(Adress $adress): self
   {
       if ($this->adresses->contains($adress)) {
           $this->adresses->removeElement($adress);
           // set the owning side to null (unless already changed)
           if ($adress->getCountry() === $this) {
               $adress->setCountry(null);
           }
       }

       return $this;
   }
}
