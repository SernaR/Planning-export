<?php

namespace App\Entity;

use App\Repository\DestinationParamsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass=DestinationParamsRepository::class)
 * @ApiResource(
 *  collectionOperations={"get"},
 *  itemOperations={"get"},
 *  normalizationContext={
 *      "groups"={"destination_params_read"}
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={"country": "exact"})
 */
class DestinationParams
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity=Country::class, cascade={"persist", "remove"})
     * @Groups({"destination_params_read"})
     */
    private $country;

    /**
     * @ORM\ManyToMany(targetEntity=Carrier::class, inversedBy="destinationParams")
     * @Groups({"destination_params_read"})
     */
    private $carriers;

    /**
     * @ORM\OneToMany(targetEntity=Warehouse::class, mappedBy="destinationParams")
     * @Groups({"destination_params_read"})
     */
    private $warehouses;

    public function __construct()
    {
        $this->carriers = new ArrayCollection();
        $this->warehouses = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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
        }

        return $this;
    }

    public function removeCarrier(Carrier $carrier): self
    {
        if ($this->carriers->contains($carrier)) {
            $this->carriers->removeElement($carrier);
        }

        return $this;
    }

    /**
     * @return Collection|Warehouse[]
     */
    public function getWarehouses(): Collection
    {
        return $this->warehouses;
    }

    public function addWarehouse(Warehouse $warehouse): self
    {
        if (!$this->warehouses->contains($warehouse)) {
            $this->warehouses[] = $warehouse;
            $warehouse->setDestinationParams($this);
        }

        return $this;
    }

    public function removeWarehouse(Warehouse $warehouse): self
    {
        if ($this->warehouses->contains($warehouse)) {
            $this->warehouses->removeElement($warehouse);
            // set the owning side to null (unless already changed)
            if ($warehouse->getDestinationParams() === $this) {
                $warehouse->setDestinationParams(null);
            }
        }

        return $this;
    }
}
