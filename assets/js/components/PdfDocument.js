import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        //flexDirection: 'row',
        backgroundColor: '#f4f4f4',
        margin: 30
    },
    section: {
        textAlign: 'center',  
        color: 'red',  
        margin: 10,
        padding: 10,
     // flexGrow: 1
    }
  });

export function PdfDocument({order}) {
    return (
        <Document>
            <Page size="A4"style={styles.page}>
                { order && <>
                    <View style={styles.section}>
                        <Text>texte 1 : {order.carrier} </Text>
                    </View>
                </>}
            </Page>
        </Document>
    );
}  

export default PdfDocument

