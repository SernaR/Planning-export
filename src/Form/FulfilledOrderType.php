<?php

namespace App\Form;

use App\Entity\TransportOrder;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FulfilledOrderType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('code')
            ->add('firstLoadingStart')
            ->add('firstLoadingEnd')
            ->add('firstDelivery')
            ->add('amount')
            ->add('effectiveFirstLoadingStart')
            ->add('effectiveFirstLoadingEnd')
            ->add('effectiveFirstLoadingBoxes')
            ->add('effectiveFirstLoadingPallets')
            ->add('effectiveFirstLoadingPieces')
            ->add('effectiveFirstDelivery')
            ->add('weight')
            ->add('volume')
            ->add('createdAt')
            ->add('updatedAt')
            ->add('carrier')
            ->add('firstLoadingWarehouse')
            ->add('vehicle')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => TransportOrder::class,
        ]);
    }
}
