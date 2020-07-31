<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CountryRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * 
 * @ORM\Entity(repositoryClass=CountryRepository::class)
 */
class Country
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
     * @Groups({"orders_read", "initial_params_read"})
     * 
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $code;

    /**
     * @ORM\OneToMany(targetEntity=Adress::class, mappedBy="country")
     * 
     */
    private $adresses;

    /**
     * @ORM\ManyToOne(targetEntity=InitialParams::class, inversedBy="countries")
     */
    private $initialParams;

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
