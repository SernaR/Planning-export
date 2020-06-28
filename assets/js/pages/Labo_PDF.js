import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "../components/PdfDocument";
import { Link } from "react-router-dom";

const movieDetails = {
   " one": "Section #1",
    "two": "Section #1",
    "three": "Section #1"
}

export default function Labo_PDF() {

    return ( <>
     <PDFDownloadLink
        document={<PdfDocument data={movieDetails} />}
        fileName="testPDF.pdf"
        className="btn"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "download"
        }
      </PDFDownloadLink>
      <Link to="/pdf-viewer">Viewer</Link>
  </>)
}
