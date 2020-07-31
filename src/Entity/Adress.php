<?php

namespace App\Entity;

use App\Repository\AdressRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=AdressRepository::class)
 */
class Adress
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"order_read"})
     */
    private $main;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"order_read"})
     */
    private $secondary;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"order_read"})
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"order_read"})
     */
    private $city;

    /**
     * @ORM\ManyToOne(targetEntity=Country::class, inversedBy="adresses")
     * 
     */
    private $country;

    /**
     * @ORM\OneToOne(targetEntity=Warehouse::class, mappedBy="adress")
     * @Groups({"country_read"})
     */
    private $warehouse;


    public function __toString()
    {
       return $this->main.' '.$this->code.' '.$this->city;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMain(): ?string
    {
        return $this->main;
    }

    public function setMain(string $main): self
    {
        $this->main = $main;

        return $this;
    }

    public function getSecondary(): ?string
    {
        return $this->secondary;
    }

    public function setSecondary(?string $secondary): self
    {
        $this->secondary = $secondary;

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

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getCountry(): ?Country
    {
        return $this->country;
    }

    public function setCountry(?Country $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getWarehouse(): ?Warehouse
    {
        return $this->warehouse;
    }

    public function setWarehouse(?Warehouse $warehouse): self
    {
        $this->warehouse = $warehouse;

        return $this;
    }
}
