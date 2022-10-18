const express = require('express');
const { transactionController } = require('../controllers');
const { readToken } = require('../config/encript');
const { uploader } = require('../config/upload');
const route = express.Router();

const prescriptionUploader = uploader('/prescription', 'prescription').array('prescription_pic', 1);
const paymentProofUploader = uploader('/paymentproof', 'paymentproof').array('paymentproof_pic', 1);

// PRESCRIPTION

route.get('/all', readToken, transactionController.getTransaction);

route.post('/addprescription', prescriptionUploader, readToken, transactionController.addTransaction);
route.post('/add', readToken, transactionController.addTransaction);
route.patch('/addproof', paymentProofUploader, readToken, transactionController.updateTransaction);
route.patch('/update', transactionController.updateTransaction);

// REPORT
route.get('/report', transactionController.getReport)

// HISTORY
route.get('/history', transactionController.getHistory)
module.exports = route