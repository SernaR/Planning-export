import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument'

const PdfViewer = () => (
  <PDFViewer>
    <PdfDocument />
  </PDFViewer>
);

export default PdfViewer