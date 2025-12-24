import { Router } from "express";
import { protectRoute } from "../../middlewares/only-admin/auth.middleware";
import { createReview, deleteReview } from "../../controllers/users/reviews/review.controller";

const reviewRoutes: Router = Router();

reviewRoutes.use(protectRoute)

reviewRoutes.post('/', createReview)
reviewRoutes.delete('/:reviewId', deleteReview)

export default reviewRoutes