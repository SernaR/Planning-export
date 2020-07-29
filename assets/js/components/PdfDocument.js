import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image
} from "@react-pdf/renderer";

import moment from 'moment'

const styles = StyleSheet.create({
    page: {
      fontSize: '8px',
      display: 'flex'
    },
    logo: {
      fontSize: '20px',
    },
    section: {
        border: '1px solid #000',
        //borderBottom: '1px solid #000',
        margin: '10 30',
        padding: 10,
    },
    cockpit : {
      marginTop: 20,
      //border: '1px solid red',
      flexDirection: 'row',
      justifyContent: 'space-between',  
      alignItems: 'baseline',
      //borderBottom: '1px solid #000',
    },
    body1: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    body2: {
      //border: '1px solid red',
      padding: '30 10 0 10'
    },
    title1: {
      borderBottom: '1px solid #000',
      textAlign: 'center',
      fontSize: '12px',
      fontWeight: 700,
      marginBottom: 10,
      padding: 10
    },
    title2: {
      fontSize: '10px',
      fontWeight: 700,
      paddingBottom: 5
    },
    gutterBottom: {
      paddingBottom: '8px',
    }
  });

  export default function PdfDocument({order}) {  //
    return (
      <Document>
      <Page size="A4" style={styles.page}>
        { order && <>
          <View style={styles.section}>
            <View style={styles.cockpit}>
              <Text style={styles.logo}>La Redoute</Text>
              <Text>{moment(order.updatedAt).format('DD/MM/YYYY')} </Text>
            </View>
          </View>  
          <View style={styles.section}>    
            <Text style={styles.title1}> Ordre de chargement / Transport Order {order.code}</Text>
            <View style={styles.body1}>
              <View>
                <Text style={styles.title2}>DONNEUR D'ORDRE / PRINCIPAL</Text>
                <Text style={styles.title2}>La Redoute</Text>
                <Text>110, rue Blanchemaille</Text>
                <Text style={styles.gutterBottom}>59100 Roubaix</Text>
                <Text>tel: 03 20 69 69 32</Text>
                <Text>Num TVA fr0000000000</Text>
              </View>
              <View>
                <Text style={styles.title2}>TRANSPORTEUR / CARRIER</Text>
                <Text style={styles.title2}>{order.carrier && order.carrier.name}</Text>
                <Text>{order.carrier && order.carrier.adress.main}</Text>
                <Text>{order.carrier && order.carrier.adress.secondary}</Text>
                <Text style={styles.gutterBottom}>{order.carrier && order.carrier.adress.code} {order.carrier && order.carrier.adress.city}</Text>
                <Text>Tel: {order.carrier && order.carrier.telephone}</Text>
                <Text>{order.carrier && order.carrier.email}</Text>
              </View>
            </View>
            <View style={styles.body2}>
              <Text>Vehicule affrêté : {order.vehicle && order.vehicle.name}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.title1}> Chargement / Loading</Text>
            <View style={styles.body1}>
              <View>
                <Text style={styles.title2}>1 - {order.firstLoadingWarehouse && order.firstLoadingWarehouse.name}</Text>
                <Text>{order.firstLoadingWarehouse && order.firstLoadingWarehouse.adress.main}</Text>
                <Text>{order.firstLoadingWarehouse && order.firstLoadingWarehouse.adress.secondary}</Text>
                <Text style={styles.gutterBottom}>{order.firstLoadingWarehouse && order.firstLoadingWarehouse.adress.code} { order.firstLoadingWarehouse && order.carrier.adress.city}</Text>
                <Text>Date de départ : {moment(order.firstLoadingStart).format('DD/MM/YYYY')}</Text>
                <Text>Heure de début : {moment(order.firstLoadingStart).format('HH:mm')}</Text>
                <Text>Heure de fin : {moment(order.firstLoadingEnd).format('HH:mm')}</Text>
              </View>
              
              <View>
                <Text style={styles.title2}>2 - {order.secondLoadingWarehouse && order.secondLoadingWarehouse.name}</Text>
                <Text>{order.secondLoadingWarehouse && order.secondLoadingWarehouse.adress.main}</Text>
                <Text>{order.secondLoadingWarehouse && order.secondLoadingWarehouse.adress.secondary}</Text>
                <Text style={styles.gutterBottom}>{order.secondLoadingWarehouse && order.secondLoadingWarehouse.adress.code} {order.secondLoadingWarehouse && order.secondLoadingWarehouse.adress.city}</Text>
                <Text>Date de départ : {order.secondLoadingStart && moment(order.secondLoadingStart).format('DD/MM/YYYY')}</Text>
                <Text>Heure de début : {order.secondLoadingStart && moment(order.secondLoadingStart).format('HH:mm')}</Text>
                <Text>Heure de fin : {order.secondLoadingEnd && moment(order.secondLoadingEnd).format('HH:mm')}</Text>
              </View>
            </View> 
          </View>

          <View style={styles.section}>
            <Text style={styles.title1}> Livraison / Delivery</Text>
            <View style={styles.body1}>
              <View>
                <Text style={styles.title2}>1 - {order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.name}</Text>
                <Text>{order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.adress.main}</Text>
                <Text>{order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.adress.secondary}</Text>
                <Text style={styles.gutterBottom}>{order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.adress.code} {order.firstDeliveryWarehouse && order.firstDeliveryWarehouse.adress.city}</Text>
                <Text>Date de départ : {moment(order.firstDelivery).format('DD/MM/YYYY')}</Text>
                <Text>Heure de début : {moment(order.firstDelivery).format('HH:mm')}</Text>
              </View> 
              <View>
                  <Text style={styles.title2}>1 - {order.secondDeliveryWarehouse && order.secondDeliveryWarehouse.name}</Text>
                  <Text>{order.secondDeliveryWarehouse && order.secondDeliveryWarehouse.adress.main}</Text>
                  <Text>{order.secondDeliveryWarehouse && order.secondDeliveryWarehouse.adress.secondary}</Text>
                  <Text style={styles.gutterBottom}>{order.secondDeliveryWarehouse && order.secondDeliveryWarehouse.adress.code} {order.secondDeliveryWarehouse && order.secondDeliveryWarehouse.adress.city}</Text>
                  <Text>Date de départ : {order.secondDelivery && moment(order.secondDelivery).format('DD/MM/YYYY')}</Text>
                  <Text>Heure de début : {order.secondDelivery && moment(order.secondDelivery).format('HH:mm')}</Text>
              </View> 
            </View>
            <View style={styles.body2}>
              <Text>Numéro de commande : {order.code}</Text>
              <Text>affrètement : {order.amount} € all in</Text>
            </View>
          </View>
        </>}
      </Page>
    </Document>
  );
}
