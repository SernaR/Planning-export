<?php

namespace App\Form;

use App\Entity\OrderSearch;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class OrderFilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('code', TextType::class, [
                'required' => false,
                'label' => false,
                'attr' => [
                    'class' => "form-control",
                    'placeholder' => 'Order de Transport'
                ]
            ])
            ->add('country', TextType::class, [
                'required' => false,
                'label' => false,
                'attr' => [
                    'class' => "form-control",
                    'placeholder' => 'Transporteur'
                ]
            ])
            ->add('carrier', TextType::class, [
                'required' => false,
                'label' => false,
                'attr' => [
                    'class' => "form-control",
                    'placeholder' => 'Transporteur'
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => OrderSearch::class,
            'method' => 'get',
            'csrf protection' => false,
            
        ]);
    }

    public function getBlockPrefix()
    {
        return '';
    }
}
