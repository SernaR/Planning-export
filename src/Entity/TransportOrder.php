<?php

namespace App\Entity;

use App\Repository\TransportOrderRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Gedmo\Mapping\Annotation as Gedmo;

use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;

/**
 * @ORM\Entity(repositoryClass=TransportOrderRepository::class)
 * @UniqueEntity("code")
 * @ApiResource(
 *  normalizationContext={"groups"={"order_read"}},
 *  itemOperations={"put", "get"},
 *  collectionOperations={
 *      "get"={
 *          "normalization_context"={"groups"={"orders_read"}}
 *      },
 *      "post"={
 *          "controller"=App\Controller\Api\OrderController::class
 *      }
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *  "code": "partial",
 *  "carrier.name": "partial",
 *  "firstDeliveryWarehouse.adress.country.name": "partial"
 * })
 * @ApiFilter(ExistsFilter::class, properties={"effectiveFirstLoadingStart", "invoice"})
 * @ApiFilter(DateFilter::class, properties={"firstLoadingStart"})
 * @ApiFilter(OrderFilter::class, properties={"code", "firstLoadingStart"}, arguments={"orderParameterName"="order"})
 * @ApiFilter(BooleanFilter::class, properties={"isCancelled"})
 */
class TransportOrder
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"orders_read", "order_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Groups({"orders_read", "order_read"})
     */
    private $code;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank
     * 
     * @Groups({"orders_read", "order_read"})
     */
    private $firstLoadingStart;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank
     * @Groups({"order_read"})
     */
    private $firstLoadingEnd;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank
     * @Groups({"order_read"})
     */
    private $firstDelivery;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Assert\PositiveOrZero
     * @Groups({"orders_read", "order_read"})
     */
    private $amount ;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"orders_read", "order_read"})
     */
    private $effectiveFirstLoadingStart;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"order_read"})
     */
    private $effectiveFirstLoadingEnd;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\PositiveOrZero
     * @Groups({"order_read"})
     */
    private $effectiveFirstLoadingBoxes;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\PositiveOrZero
     * @Groups({"order_read"})
     */
    private $effectiveFirstLoadingPallets;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\PositiveOrZero
     * @Groups({"order_read"})
     */
    private $effectiveFirstLoadingPieces;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"order_read"})
     */
    private $effectiveFirstDelivery;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\PositiveOrZero
     * @Groups({"order_read"})
     */
    private $weight;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Assert\PositiveOrZero
     * @Groups({"order_read"})
     */
    private $volume;

    /**
     * @ORM\ManyToOne(targetEntity=Carrier::class, inversedBy="transportOrders", cascade={"persist", "remove"})
     * @Assert\NotBlank
     * @Groups({"orders_read", "order_read"})
     */
    private $carrier;

    /**
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="firstLoadings", cascade={"persist", "remove"})
     * @Assert\NotBlank
     * @Groups({"order_read"})
     */
    private $firstLoadingWarehouse;

    /**
     * @ORM\ManyToOne(targetEntity=Vehicle::class, inversedBy="transportOrders", cascade={"persist", "remove"})
     * @Assert\NotBlank
     * @Groups({"orders_read", "order_read"})   
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
     * @Groups({"order_read"})
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity=Warehouse::class, inversedBy="firstDeliveries", cascade={"persist", "remove"})
     * @Assert\NotBlank
     * @Groups({"orders_read", "order_read"})
     */
    private $firstDeliveryWarehouse;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"orders_read", "order_read"})
     */
    private $invoice;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"order_read"})
     */
    private $comment;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"orders_read", "order_read"})
     */
    private $isCancelled = false;

    /**
     * @Groups({"orders_read", "order_read"})   
     */
    private $country;

    public function getCountry()
    {
        return [
            'id' => $this->getFirstDeliveryWarehouse()->getAdress()->getCountry()->getId(),
            'name' =>$this->getFirstDeliveryWarehouse()->getAdress()->getCountry()->getName()
        ];   
    }

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

    public function getInvoice(): ?string
    {
        return $this->invoice;
    }

    public function setInvoice(?string $invoice): self
    {
        $this->invoice = $invoice;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    public function getIsCancelled(): ?bool
    {
        return $this->isCancelled;
    }

    public function setIsCancelled(?bool $isCancelled): self
    {
        $this->isCancelled = $isCancelled;

        return $this;
    }
}
