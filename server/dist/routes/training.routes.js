"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const training_controller_1 = require("../controllers/training.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Protect all routes
router.use(auth_middleware_1.authenticateToken);
router.get('/status', training_controller_1.getTrainingStatus);
router.get('/module/:moduleId', training_controller_1.getModuleDetails);
router.post('/module/:moduleId/complete', training_controller_1.completeModule);
exports.default = router;
