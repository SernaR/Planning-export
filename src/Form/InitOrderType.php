<?php

namespace App\Form;

use App\Entity\Country;
use App\Entity\TransportOrder;
use App\Entity\Vehicle;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class InitOrderType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            //->add('code')
            //->add('carrier', )
            ->add('country', EntityType::class, [
                'class' => Country::class,
                'choice_label' => 'name',
                'mapped' => false
            ])
            ->add('vehicle', EntityType::class, [
                'class' => Vehicle::class,
                'choice_label' => 'name'
            ])
            //->add('firstLoadingWarehouse')
            ->add('firstLoadingStart')
            ->add('firstLoadingEnd')
            ->add('firstDelivery')
            ->add('amount')
            ->add('createdAt')
            ->add('updatedAt')    
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => TransportOrder::class,
        ]);
    }
}
