<?php

namespace App\Entity;

use App\Repository\TransportOrderRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Gedmo\Mapping\Annotation as Gedmo;

use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;


/**
 * @ORM\Entity(repositoryClass=TransportOrderRepository::class)
 * @UniqueEntity("code")
 * @ApiResource(
 *  collectionOperations={
 *      "get",
 *      "post"={
 *          "controller"=App\Controller\Api\OrderController::class
 *      }
 *  },
 *  normalizationContext={
 *      "groups"={"orders_read"}
 *  }
 * )
 */
class TransportOrder
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Groups({"orders_read"})
     */
    private $code = 'test';

    /**
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank
     * 
     * @Groups({"orders_read"})
     */
    private $firstLoadingStart;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank
     * 
     */
    private $firstLoadingEnd;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank
     *
     */
    private $firstDelivery;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Assert\PositiveOrZero
     * @Groups({"orders_read"})
     */
    private $amount ;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Assert\DateTime(message="plop")
     */
    private $effectiveFirstLoadingStart;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Assert\DateTime
     */
    private $effectiveFirstLoadingEnd;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\PositiveOrZero
     * 
     */
    private $effectiveFirstLoadingBoxes;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\PositiveOrZero
     */
    private $effectiveFirstLoadingPallets;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\PositiveOrZero
     */
    private $effectiveFirstLoadingPieces;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Assert\DateTime
     */
    private $effectiveFirstDelivery;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\PositiveOrZero
     */
    private $weight;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\PositiveOrZero
     */
    private $volume;

    /**
     * @ORM\ManyToOne(targetEntity=Carrier::class, inversedBy="transportOrders", cascade={"persist", "remove"})
     * @Assert\NotBlank
     * @Groups({"orders_read"})
     */
    private $carrier;

    /**
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="firstLoadings", cascade={"persist", "remove"})
     * @Assert\NotBlank
     */
    private $firstLoadingWarehouse;

    /**
     * @ORM\ManyToOne(targetEntity=Vehicle::class, inversedBy="transportOrders", cascade={"persist", "remove"})
     * @Assert\NotBlank
     */
    private $vehicle;

    /**
     * @ORM\Column(type="datetime")
     * @Gedmo\Timestampable(on="create")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Gedmo\Timestampable(on="update")
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="firstDeliveries", cascade={"persist", "remove"})
     * @Assert\NotBlank
     * @Groups({"orders_read"})
     */
    private $firstDeliveryWarehouse;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getFirstLoadingStart(): ?\DateTimeInterface
    {
        return $this->firstLoadingStart;
    }

    public function setFirstLoadingStart(\DateTimeInterface $firstLoadingStart): self
    {
        $this->firstLoadingStart = $firstLoadingStart;

        return $this;
    }

    public function getFirstLoadingEnd(): ?\DateTimeInterface
    {
        return $this->firstLoadingEnd;
    }

    public function setFirstLoadingEnd(\DateTimeInterface $firstLoadingEnd): self
    {
        $this->firstLoadingEnd = $firstLoadingEnd;

        return $this;
    }

    public function getFirstDelivery(): ?\DateTimeInterface
    {
        return $this->firstDelivery;
    }

    public function setFirstDelivery(\DateTimeInterface $firstDelivery): self
    {
        $this->firstDelivery = $firstDelivery;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(?float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getEffectiveFirstLoadingStart(): ?\DateTimeInterface
    {
        return $this->effectiveFirstLoadingStart;
    }

    public function setEffectiveFirstLoadingStart(?\DateTimeInterface $effectiveFirstLoadingStart): self
    {
        $this->effectiveFirstLoadingStart = $effectiveFirstLoadingStart;

        return $this;
    }

    public function getEffectiveFirstLoadingEnd(): ?\DateTimeInterface
    {
        return $this->effectiveFirstLoadingEnd;
    }

    public function setEffectiveFirstLoadingEnd(?\DateTimeInterface $effectiveFirstLoadingEnd): self
    {
        $this->effectiveFirstLoadingEnd = $effectiveFirstLoadingEnd;

        return $this;
    }

    public function getEffectiveFirstLoadingBoxes(): ?int
    {
        return $this->effectiveFirstLoadingBoxes;
    }

    public function setEffectiveFirstLoadingBoxes(?int $effectiveFirstLoadingBoxes): self
    {
        $this->effectiveFirstLoadingBoxes = $effectiveFirstLoadingBoxes;

        return $this;
    }

    public function getEffectiveFirstLoadingPallets(): ?int
    {
        return $this->effectiveFirstLoadingPallets;
    }

    public function setEffectiveFirstLoadingPallets(?int $effectiveFirstLoadingPallets): self
    {
        $this->effectiveFirstLoadingPallets = $effectiveFirstLoadingPallets;

        return $this;
    }

    public function getEffectiveFirstLoadingPieces(): ?int
    {
        return $this->effectiveFirstLoadingPieces;
    }

    public function setEffectiveFirstLoadingPieces(?int $effectiveFirstLoadingPieces): self
    {
        $this->effectiveFirstLoadingPieces = $effectiveFirstLoadingPieces;

        return $this;
    }

    public function getEffectiveFirstDelivery(): ?\DateTimeInterface
    {
        return $this->effectiveFirstDelivery;
    }

    public function setEffectiveFirstDelivery(?\DateTimeInterface $effectiveFirstDelivery): self
    {
        $this->effectiveFirstDelivery = $effectiveFirstDelivery;

        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(?float $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getVolume(): ?float
    {
        return $this->volume;
    }

    public function setVolume(?float $volume): self
    {
        $this->volume = $volume;

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

    public function getFirstLoadingWarehouse(): ?Warehouse
    {
        return $this->firstLoadingWarehouse;
    }

    public function setFirstLoadingWarehouse(?Warehouse $firstLoadingWarehouse): self
    {
        $this->firstLoadingWarehouse = $firstLoadingWarehouse;

        return $this;
    }

    public function getVehicle(): ?Vehicle
    {
        return $this->vehicle;
    }

    public function setVehicle(?Vehicle $vehicle): self
    {
        $this->vehicle = $vehicle;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

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
}
