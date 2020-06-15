<?php

namespace App\Entity;

class OrderSearch
{
/**
 * @var string|null
 */    
private $code;

/**
 * @var string|null
 */    
private $country;

/**
 * @var string|null
 */    
private $carrier;

public function getCountry(): ?string
    {
        return $this->country;
    }

public function setCountry(string $country): self
{
    $this->country = $country;

    return $this;
}

public function getCarrier(): ?string
    {
        return $this->carrier;
    }

public function setCarrier(string $carrier): self
{
    $this->carrier = $carrier;

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

}