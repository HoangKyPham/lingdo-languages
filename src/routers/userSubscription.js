import express from 'express';

import { createPaymentUrl, createUserSubsctiption, getUserSubsctiptionById } from '../controllers/userSubscription';

const router = express.Router();

router.get('/create-payment-url', createPaymentUrl);
router.post('/create-user-subsctiption', createUserSubsctiption);
router.post('/get-user-subsctiption', getUserSubsctiptionById);

// // Function to sort the object properties
// function sortObject(obj) {
//     var sorted = {};
//     var str = [];
//     var key;
//     for (key in obj) {
//         if (obj.hasOwnProperty(key)) {
//             str.push(encodeURIComponent(key));
//         }
//     }
//     str.sort();
//     for (key = 0; key < str.length; key++) {
//         sorted[str[key]] = obj[str[key]];
//     }
//     return sorted;
// }




export default router;
