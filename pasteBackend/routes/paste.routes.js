import { Router } from "express";
import { createPaste, deletePaste, editPaste, getAllPastes, getPasteById } from "../Controller/paste.js";
import { auth, isUser } from "../middleware/auth.js";
import createPasteLimiter from "../utlis/rateLimiter.js";

const router = Router();

router.post('/', auth, isUser, createPasteLimiter, createPaste);
router.get('/get-paste/:pasteId', auth, isUser, getPasteById);
// router.get('/share/:pasteId', auth, isUser, sharePaste);

// router.post('/new-paste', createPaste);
// router.get('/:uniqueId', getPasteById);
// router.get('/share/:uniqueId', sharePaste);
// Route to edit an existing paste by its unique ID
router.put('/edit/:pasteId', auth, editPaste);
// router.put('/edit/:uniqueId', editPaste);
router.delete('/delete/:pasteId', auth, deletePaste);
// router.delete('/delete/:uniqueId', deletePaste);
router.get('/all-pastes', auth, getAllPastes);


export default router;