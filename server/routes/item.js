import express from 'express';
import { createItem, getItemById, deleteItem, updateItemById, getItemsByUserId } from '../controllers/itemController.js';



const router = express.Router();

router.post('/' ,createItem);
router.get('/:id', getItemById);
router.delete('/delete/:id', deleteItem);
router.post('/update/:listingId' ,updateItemById);
router.get('/store/:userId', getItemsByUserId);

export default router;