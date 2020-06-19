<?php

namespace App\Entity;


use App\Repository\InitialParamsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *  collectionOperations={},
 *  itemOperations={"get"},
 *  normalizationContext={
 *      "groups"={"initial_params_read"}
 *  }
 * )
 * @ORM\Entity(repositoryClass=InitialParamsRepository::class)
 */
class InitialParams
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity=Country::class, mappedBy="initialParams")
     * @Groups({"initial_params_read"})
     */
    private $countries;

    /**
     * @ORM\OneToMany(targetEntity=Vehicle::class, mappedBy="initialParams")
     * @Groups({"initial_params_read"})
     */
    private $vehicles;

    /**
     * @ORM\OneToMany(targetEntity=Warehouse::class, mappedBy="initialParams")
     * @Groups({"initial_params_read"})
     */
    private $warehouses;

    public function __construct()
    {
        $this->countries = new ArrayCollection();
        $this->vehicles = new ArrayCollection();
        $this->warehouses = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection|Country[]
     */
    public function getCountries(): Collection
    {
        return $this->countries;
    }

    public function addCountry(Country $country): self
    {
        if (!$this->countries->contains($country)) {
            $this->countries[] = $country;
            $country->setInitialParams($this);
        }

        return $this;
    }

    public function removeCountry(Country $country): self
    {
        if ($this->countries->contains($country)) {
            $this->countries->removeElement($country);
            // set the owning side to null (unless already changed)
            if ($country->getInitialParams() === $this) {
                $country->setInitialParams(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Vehicle[]
     */
    public function getVehicles(): Collection
    {
        return $this->vehicles;
    }

    public function addVehicle(Vehicle $vehicle): self
    {
        if (!$this->vehicles->contains($vehicle)) {
            $this->vehicles[] = $vehicle;
            $vehicle->setInitialParams($this);
        }

        return $this;
    }

    public function removeVehicle(Vehicle $vehicle): self
    {
        if ($this->vehicles->contains($vehicle)) {
            $this->vehicles->removeElement($vehicle);
            // set the owning side to null (unless already changed)
            if ($vehicle->getInitialParams() === $this) {
                $vehicle->setInitialParams(null);
            }
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
            $warehouse->setInitialParams($this);
        }

        return $this;
    }

    public function removeWarehouse(Warehouse $warehouse): self
    {
        if ($this->warehouses->contains($warehouse)) {
            $this->warehouses->removeElement($warehouse);
            // set the owning side to null (unless already changed)
            if ($warehouse->getInitialParams() === $this) {
                $warehouse->setInitialParams(null);
            }
        }

        return $this;
    }
}
