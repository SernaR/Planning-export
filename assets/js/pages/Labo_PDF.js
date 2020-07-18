import React from "react";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import PdfDocument from "../components/PdfDocument";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { ORDERS_API } from "../services/config";
import API from '../services/api'

export default function Labo_PDF() {
  const {data, error} = useSWR(ORDERS_API + '/101', API.fetcher )

  if(error) return <div>Fail to load</div>
  if(!data) return <div>Loading...</div>
  return <div>
    <div>
      <BlobProvider document={<PdfDocument order={data} />}>
        {({ blob, url, loading, error }) => {
          // Do whatever you need with blob here
          return <a href={url} target="_blank">PDF</a>
        }}
      </BlobProvider>
    </div>
    <pre>{JSON.stringify(data, null, 4)}</pre>
  </div>
}
